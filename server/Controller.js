const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("./models/User");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @route  POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route  POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route  POST /api/auth/google
// Verifies the access token the frontend got from Google (via
// @react-oauth/google's useGoogleLogin), then finds-or-creates a user
// in Atlas and returns our own JWT — same response shape as register/login.
exports.google = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ message: "Missing Google access token" });
    }

    // Ask Google who this token belongs to. If the token is fake/expired,
    // this call itself will fail (caught below).
    const { data: googleUser } = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const { sub: googleId, email, name } = googleUser;

    if (!email) {
      return res.status(400).json({ message: "Google account has no email" });
    }

    let user = await User.findOne({ email });

    if (user) {
      // Existing account (maybe originally signed up with email/password).
      // Link the Google id if it's not already linked, but don't touch
      // their password or provider — keeps local login working too.
      if (!user.providerId) {
        user.providerId = googleId;
        await user.save();
      }
    } else {
      // Brand new user — this is effectively "signup" via Google.
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        provider: "google",
        providerId: googleId,
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    if (err.response?.status === 401) {
      return res.status(401).json({ message: "Invalid or expired Google token" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @route  POST /api/auth/facebook
// Verifies the access token the frontend got from the Facebook SDK
// (FB.login), then finds-or-creates a user in Atlas and returns our own
// JWT — same response shape as register/login/google.
exports.facebook = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ message: "Missing Facebook access token" });
    }

    // Step 1: confirm this token was actually issued for OUR app, not
    // some other app, using the app access token (App ID|App Secret).
    const appAccessToken = `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;

    const { data: debugData } = await axios.get(
      "https://graph.facebook.com/debug_token",
      {
        params: {
          input_token: access_token,
          access_token: appAccessToken,
        },
      }
    );

    if (!debugData.data?.is_valid || debugData.data.app_id !== process.env.FACEBOOK_APP_ID) {
      return res.status(401).json({ message: "Invalid Facebook token" });
    }

    // Step 2: fetch the actual profile info using the user's token.
    const { data: fbUser } = await axios.get("https://graph.facebook.com/me", {
      params: {
        fields: "id,name,email",
        access_token,
      },
    });

    const { id: facebookId, email, name } = fbUser;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Facebook account has no email. Please use another method." });
    }

    let user = await User.findOne({ email });

    if (user) {
      // Existing account — link the Facebook id if not already linked,
      // without touching password or provider.
      if (!user.providerId) {
        user.providerId = facebookId;
        await user.save();
      }
    } else {
      // Brand new user — this is effectively "signup" via Facebook.
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        provider: "facebook",
        providerId: facebookId,
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    if (err.response?.status === 400 || err.response?.data?.error) {
      return res.status(401).json({ message: "Invalid or expired Facebook token" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
