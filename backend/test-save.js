const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/jobportal").then(async () => {
    try {
        const user = await User.findOne({ email: "ann@gmail.com" }); // Or try any user
        if (!user) {
            console.log("User not found");
            process.exit(0);
        }

        user.otp = "123456";
        user.otpExpiry = new Date();

        await user.save();
        console.log("Save successful!");
    } catch (err) {
        console.error("Save failed:", err);
    } finally {
        process.exit(0);
    }
});
