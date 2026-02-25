const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        salary: {
            type: String,
            required: true,
        },
        skills: {
            type: [String], // Array of skills
            required: true,
        },
        experience: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
            default: "Full-time"
        },
        deadline: Date,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
