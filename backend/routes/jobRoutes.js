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

// GET /api/jobs/recommended/:userId - Get AI Recommended Jobs
router.get("/recommended/:userId", async (req, res) => {
    try {
        const User = require("../models/User");
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // 1. Extract user skills (convert to array, lowercase, remove whitespace)
        let userSkills = [];
        if (user.skills) {
            userSkills = user.skills.split(",").map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
        }

        const hasSkills = userSkills.length > 0;

        // We can also extract keywords from their education or experience if needed
        // For Option A, we stick to explicit skills + experience keywords
        if (user.experience) {
            const expWords = user.experience.split(" ").map(w => w.trim().toLowerCase());
            userSkills = [...userSkills, ...expWords];
        }

        const allJobs = await Job.find().populate("postedBy", "firstName lastName company");

        // 2. Score each job
        const scoredJobs = allJobs.map(job => {
            let score = 0;
            const jobText = `${job.title} ${job.skillsRequired || job.skills?.join(" ")} ${job.description}`.toLowerCase();

            userSkills.forEach(skill => {
                // Give higher weight if the exact skill sequence is found
                if (jobText.includes(skill)) {
                    score += 10;
                }
            });

            // Standardize score to a rough percentage (maxing out at 100 for display purposes)
            // Assuming 3 matching skills is a "100%" match for a basic system
            let matchPercentage = Math.min(Math.round((score / 30) * 100), 100);

            // Give a baseline 10% to all jobs so it doesn't look completely empty if they have few skills,
            // but keep 0 score jobs easily filterable.
            if (score > 0) {
                matchPercentage = Math.max(matchPercentage, 40); // Floor matches at 40%
            } else {
                matchPercentage = 0;
            }

            return {
                ...job.toObject(), // Convert mongoose doc to plain JS object
                matchScore: score,
                matchPercentage: matchPercentage
            };
        });

        // 3. Filter and Sort
        // Only keep jobs with at least *some* match if the user has skills, 
        // else return recent jobs with 0 score (as a fallback).
        let recommendations = scoredJobs;
        if (hasSkills) {
            recommendations = scoredJobs.filter(job => job.matchScore > 0);
        }

        recommendations.sort((a, b) => b.matchScore - a.matchScore);

        // Return top 6 recommendations with hasSkills flag
        res.json({
            hasSkills: hasSkills,
            recommendations: recommendations.slice(0, 6)
        });

    } catch (error) {
        console.error("Recommended Jobs Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
