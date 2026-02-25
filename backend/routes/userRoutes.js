const express = require("express");
const User = require("../models/User");
const router = express.Router();

// GET /api/users/:id - Get user profile
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

const multer = require("multer");
const path = require("path");

// Configure Multer for Resume Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `resume-${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"));
        }
    }
});

// PUT /api/users/:id - Update user profile (with file upload)
router.put("/:id", upload.single("resume"), async (req, res) => {
    try {
        const { education, ...otherUpdates } = req.body;
        let updateData = { ...otherUpdates };

        // Handle File Upload
        if (req.file) {
            updateData.resume = `/uploads/${req.file.filename}`;
        }

        // Handle Education (Parse if sent as JSON string from FormData)
        if (education) {
            try {
                updateData.education = typeof education === 'string' ? JSON.parse(education) : education;
            } catch (e) {
                console.error("Error parsing education JSON", e);
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET /api/users - Get all users (Admin)
router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// PATCH /api/users/:id/status - Block/Unblock user
router.patch("/:id/status", async (req, res) => {
    try {
        const { status } = req.body; // "Active" | "Blocked"
        // Note: You would likely need to add a 'status' field to User model if not storing it in 'role' or separate field
        // For SRS requirements, let's assume we add a 'status' field to User model or just use this for logic
        // Checking User model... it doesn't have status. Let's add it.
        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
