const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// --- Register User ---
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET || "secretkey", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ msg: "Registration successful", token });
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// --- Login User ---
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET || "secretkey", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ msg: "Login successful", token });
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
