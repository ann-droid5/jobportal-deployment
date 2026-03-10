require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");


const app = express();

// middlewares
const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://jobportal-deployment.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reportRoutes = require("./routes/reportRoutes"); // Added

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes); // Added
app.use("/uploads", express.static("uploads"));

// test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// connect MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/jobportal")
  .then(async () => {
    console.log("MongoDB connected ✅");
    // Create default admin if not exists
    try {
      const User = require("./models/User");
      const bcrypt = require("bcryptjs");
      const adminExists = await User.findOne({ role: "admin" });
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash("admin@123", 10);
        await User.create({
          firstName: "System",
          lastName: "Admin",
          email: "admin@gmail.com",
          password: hashedPassword,
          role: "admin",
          isVerified: true
        });

      }
    } catch (err) {
      console.error("Error creating default admin:", err);
    }
  })
  .catch((err) => console.log(err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
