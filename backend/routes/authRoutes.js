const express = require("express");
const User = require("../models/User");

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, company } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || "jobseeker",
      company
    });

    await newUser.save();

    res.status(201).json({
      message: "Signup successful",
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
        companyDetails: newUser.companyDetails,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (user.status === "Blocked") {
      return res.status(403).json({ message: "Your account has been blocked. Contact admin." });
    }

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        companyDetails: user.companyDetails,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

