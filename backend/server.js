const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/uploads", express.static("uploads"));

// test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// connect MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/jobportal")
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
