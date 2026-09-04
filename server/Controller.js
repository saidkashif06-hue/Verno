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