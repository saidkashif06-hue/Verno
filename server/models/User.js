const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // Only required for local (email/password) signups — OAuth users
      // never set a password
      required: function () {
        return this.provider === "local";
      },
    },
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    // The user's id on Google/Facebook's side — useful for linking
    // accounts or debugging, not used for auth logic itself
    providerId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
