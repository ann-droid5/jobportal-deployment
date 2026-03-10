const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
    role: {
      type: String,
      default: "jobseeker",
    },
    status: {
      type: String,
      default: "Active", // Active | Blocked
    },
    // Profile Fields
    phone: String,
    education: [{
      level: String, // e.g., "B.Tech", "MBA"
      institution: String,
      year: String
    }],
    experience: String,
    skills: String,
    resume: String, // URL or path to uploaded file
    company: String, // For employers
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpiry: Date,
    companyDetails: {
      website: String,
      location: String,
      industry: String,
      description: String,
      registrationId: String, // Registration Number / Tax ID
      size: String, // Company Size
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
