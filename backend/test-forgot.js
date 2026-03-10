require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const { sendOTPEmail } = require("./utils/emailService");

mongoose.connect("mongodb://127.0.0.1:27017/jobportal").then(async () => {
    try {
        const email = "fiya@gmail.com";
        const user = await User.findOne({ email });
        if (!user) {
            console.log("No account found");
            process.exit(0);
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        console.log("Saved user");

        await sendOTPEmail(email, otp);
        console.log("OTP sent out");

    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        process.exit(0);
    }
});
