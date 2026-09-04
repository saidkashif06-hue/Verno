const express = require("express");
const router = express.Router();
const { register, login, google, facebook } = require("./Controller");

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/google
router.post("/google", google);

// POST /api/auth/facebook
router.post("/facebook", facebook);

module.exports = router;