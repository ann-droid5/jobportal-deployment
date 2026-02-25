const express = require("express");
const Notification = require("../models/Notification");
const router = express.Router();

// GET /api/notifications/:userId - Get all notifications for a user
router.get("/:userId", async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/notifications/:userId/unread-count - Get unread count
router.get("/:userId/unread-count", async (req, res) => {
    try {
        const count = await Notification.countDocuments({ user: req.params.userId, isRead: false });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// PATCH /api/notifications/:id/read - Mark as read
router.patch("/:id/read", async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// PATCH /api/notifications/mark-all-read/:userId - Mark all as read
router.patch("/mark-all-read/:userId", async (req, res) => {
    try {
        await Notification.updateMany({ user: req.params.userId, isRead: false }, { isRead: true });
        res.json({ message: "All marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
