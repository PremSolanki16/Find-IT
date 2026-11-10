
const nodemailer = require("nodemailer");

// Send password reset email
const sendPasswordResetEmail = async (email, resetUrl) => {
    // Check whether email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email service is not configured");
    }

    // Create email transporter using environment variables
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"FindIt Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset Your FindIt Password",
        html: `
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your FindIt account password.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}"
               style="display:inline-block;padding:12px 20px;background:#8055F7;color:#ffffff;text-decoration:none;border-radius:6px;">
                Reset Password
            </a>
            <p>This link will expire in 15 minutes.</p>
            <p>If you did not request this, you can ignore this email.</p>
        `
    });
};

module.exports = { sendPasswordResetEmail };
