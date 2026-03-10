const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const User = require("../models/User"); // Needed for population

// 1. Create a new report
router.post("/", async (req, res) => {
    try {
        const { reportedBy, issueInfo, entityType, entityId } = req.body;

        // Basic validation
        if (!reportedBy || !issueInfo) {
            return res.status(400).json({ error: "Missing required fields: reportedBy and issueInfo" });
        }

        const newReport = new Report({
            reportedBy,
            issueInfo,
            entityType,
            entityId
        });

        const savedReport = await newReport.save();
        res.status(201).json(savedReport);
    } catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({ error: "Server error creating report" });
    }
});

// 2. Get all reports (for Admin Dashboard)
router.get("/", async (req, res) => {
    try {
        // Populate the user to get their name
        const reports = await Report.find()
            .populate("reportedBy", "firstName lastName email")
            .sort({ createdAt: -1 });

        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ error: "Server error fetching reports" });
    }
});

// 3. Update report status (Admin action)
router.patch("/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!["Pending", "Reviewed", "Resolved"].includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const updatedReport = await Report.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedReport) {
            return res.status(404).json({ error: "Report not found" });
        }

        res.status(200).json(updatedReport);
    } catch (error) {
        console.error("Error updating report status:", error);
        res.status(500).json({ error: "Server error updating report status" });
    }
});

// 4. Delete a report (Admin action)
router.delete("/:id", async (req, res) => {
    try {
        const deletedReport = await Report.findByIdAndDelete(req.params.id);
        if (!deletedReport) {
            return res.status(404).json({ error: "Report not found" });
        }
        res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ error: "Server error deleting report" });
    }
});

module.exports = router;
