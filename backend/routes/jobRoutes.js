const express = require("express");
const Job = require("../models/Job");
const Application = require("../models/Application");
const router = express.Router();

// POST /api/jobs - Post a job
router.post("/", async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET /api/jobs - Get all jobs with filtering
router.get("/", async (req, res) => {
    try {
        const { title, location, experience } = req.query;
        const query = {};

        if (title) {
            query.title = { $regex: title, $options: "i" }; // Case-insensitive
        }
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }
        if (experience) {
            query.experience = { $regex: experience, $options: "i" };
        }

        const jobs = await Job.find(query).populate("postedBy", "firstName lastName company");
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/jobs/:id - Get job details
router.get("/:id", async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate("postedBy", "firstName lastName");
        if (!job) return res.status(404).json({ message: "Job not found" });
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/jobs/employer/:employerId - Get jobs by employer
router.get("/employer/:employerId", async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.params.employerId });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE /api/jobs/:id - Delete a job
router.delete("/:id", async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Check ownership (or admin) - For MVP assuming frontend checks role, strictly backend should verify token
        // const user = req.user; // If we had middleware

        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: "Job removed" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
