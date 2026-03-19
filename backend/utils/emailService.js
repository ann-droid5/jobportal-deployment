const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);




console.log("EMAIL USER:", process.env.EMAIL_USER);
// Welcome email after signup
const sendWelcomeEmail = async (to, name) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Welcome to Job Portal! 🎉",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #e0e0e0;border-radius:8px;">
          <h2 style="color:#2563eb;">Welcome, ${name}! 👋</h2>
          <p>Thank you for registering at <strong>Job Portal</strong>.</p>
          <a href="https://jobportal-deployment.vercel.app"
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;">
             Go to Job Portal
          </a>
        </div>
      `,
    });

    console.log(`✅ Welcome email sent to ${to}`);
  } catch (err) {
    console.error("❌ Welcome email error:", err);
  }
};

// OTP email for forgot password
const sendOTPEmail = async (to, otp) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Your OTP for Password Reset",
      html: `
        <div style="font-family:Arial;">
          <h2>Password Reset OTP</h2>
          <h1>${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

    console.log(`✅ OTP email sent to ${to}`);
  } catch (err) {
    console.error("❌ OTP email error:", err);
  }
};

// Notification email when application status changes
const sendNotificationEmail = async (to, name, message, link) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Job Application Update 📋",
      html: `
        <div>
          <h2>Hi ${name}</h2>
          <p>${message}</p>
          <a href="https://jobportal-deployment.vercel.app${link}">
            View Application
          </a>
        </div>
      `,
    });

    console.log(`✅ Notification email sent to ${to}`);
  } catch (err) {
    console.error("❌ Notification email error:", err);
  }
};

module.exports = { sendWelcomeEmail, sendOTPEmail, sendNotificationEmail };
