const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
console.log("EMAIL USER:", process.env.EMAIL_USER);
// Welcome email after signup
const sendWelcomeEmail = async (to, name) => {
  try {
    await transporter.sendMail({
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Welcome to Job Portal! 🎉",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;">
          <h2 style="color:#2563eb;">Welcome, ${name}! 👋</h2>
          <p>Thank you for registering at <strong>Job Portal</strong>. Your account has been created successfully.</p>
          <p>You can now browse thousands of jobs and apply with ease.</p>
          <a href="http://localhost:3000" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">Go to Job Portal</a>
          <p style="margin-top:24px;color:#6b7280;font-size:13px;">If you did not create this account, please ignore this email.</p>
        </div>
      `,
    });
    console.log(`✅ Welcome email sent to ${to}`);
  } catch (err) {
    console.error("❌ Welcome email error:", err.message);
  }
};

// OTP email for forgot password
const sendOTPEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your OTP for Password Reset",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;">
          <h2 style="color:#2563eb;">Password Reset OTP</h2>
          <p>You requested a password reset. Use the OTP below. It is valid for <strong>10 minutes</strong>.</p>
          <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#1e40af;text-align:center;padding:20px;background:#eff6ff;border-radius:8px;margin:16px 0;">
            ${otp}
          </div>
          <p style="color:#6b7280;font-size:13px;">If you did not request this, please ignore this email. Your password will remain unchanged.</p>
        </div>
      `,
    });
    console.log(`✅ OTP email sent to ${to}`);
  } catch (err) {
    console.error("❌ OTP email error:", err.message);
  }
};

// Notification email when application status changes
const sendNotificationEmail = async (to, name, message, link) => {
  try {
    await transporter.sendMail({
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Update on Your Job Application 📋",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;">
          <h2 style="color:#2563eb;">Hi ${name},</h2>
          <p>${message}</p>
          <a href="http://localhost:3000${link}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">View Application</a>
          <p style="margin-top:24px;color:#6b7280;font-size:13px;">You are receiving this because you applied through Job Portal.</p>
        </div>
      `,
    });
    console.log(`✅ Notification email sent to ${to}`);
  } catch (err) {
    console.error("❌ Notification email error:", err.message);
  }
};

module.exports = { sendWelcomeEmail, sendOTPEmail, sendNotificationEmail };
