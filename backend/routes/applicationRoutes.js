const express = require("express");
const Application = require("../models/Application");
const User = require("../models/User");
const router = express.Router();

const multer = require("multer");
const path = require("path");

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
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

// POST /api/applications - Apply for a job
router.post("/", upload.single("resume"), async (req, res) => {
    try {
        const { jobId, applicantId, message, useSavedResume } = req.body;
        let resumePath = req.file ? `/uploads/${req.file.filename}` : null;

        // If no file uploaded, check if we should use saved resume
        if (!resumePath && useSavedResume === "true") {
            const user = await User.findById(applicantId);
            if (user && user.resume) {
                resumePath = user.resume;
            } else {
                return res.status(400).json({ message: "No saved resume found. Please upload one." });
            }
        }

        if (!resumePath) {
            return res.status(400).json({ message: "Resume file is required (PDF only) or use saved resume" });
        }

        // Check if already applied
        const existing = await Application.findOne({ job: jobId, applicant: applicantId });
        if (existing) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        const app = new Application({
            job: jobId,
            applicant: applicantId,
            resume: resumePath,
            message
        });

        await app.save();
        res.status(201).json(app);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET /api/applications/user/:userId - Get user's applications
router.get("/user/:userId", async (req, res) => {
    try {
        const apps = await Application.find({ applicant: req.params.userId })
            .populate({
                path: "job",
                populate: { path: "postedBy", select: "company" }
            });
        res.json(apps);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/applications/job/:jobId - Get applicants for a job
router.get("/job/:jobId", async (req, res) => {
    try {
        const apps = await Application.find({ job: req.params.jobId })
            .populate("applicant", "firstName lastName email phone resume skills education experience");
        res.json(apps);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

const Notification = require("../models/Notification");

// ...

// PATCH /api/applications/:id/status - Update status
router.patch("/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true })
            .populate("job", "title")
            .populate("applicant", "firstName"); // Populate to get data if needed

        // Create Notification for the Job Seeker
        const message = `Your application for ${app.job.title} has been updated to: ${status}`;
        await Notification.create({
            user: app.applicant._id,
            message,
            type: "info",
            link: `/applications` // Redirect to applications page
        });

        res.json(app);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/applications - Get all applications (Admin stats)
router.get("/", async (req, res) => {
    try {
        const apps = await Application.find();
        res.json(apps);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
