const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// Match frontend URLs below exactly
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
