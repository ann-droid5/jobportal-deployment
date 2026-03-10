const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        issueInfo: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Reviewed", "Resolved"],
            default: "Pending",
        },
        entityType: {
            type: String,
            enum: ["Job", "User", "System", "Other"],
            default: "Other",
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null, // ID of the job or user being reported (optional)
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
