const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["Applied", "Viewed", "Shortlisted", "Interview Scheduled", "Hired", "Rejected"],
            default: "Applied",
        },
        resume: {
            type: String, // Snapshot of resume at time of application, or link to user's resume
            required: true,
        },
        message: {
            type: String,
            default: ""
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
