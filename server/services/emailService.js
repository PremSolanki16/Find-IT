
const { google } = require("googleapis");

// Send password reset email
const sendPasswordResetEmail = async (email, resetUrl) => {
    // Check whether Gmail API credentials are configured
    if (
        !process.env.GMAIL_USER ||
        !process.env.GMAIL_CLIENT_ID ||
        !process.env.GMAIL_CLIENT_SECRET ||
        !process.env.GMAIL_REFRESH_TOKEN
    ) {
        throw new Error("Gmail API service is not configured");
    }

    // Create OAuth2 client using environment variables
    const oauth2Client = new google.auth.OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    // Create Gmail API client
    const gmail = google.gmail({
        version: "v1",
        auth: oauth2Client
    });

    // Create email message
    const message = [
        `From: FindIt Support <${process.env.GMAIL_USER}>`,
        `To: ${email}`,
        "Subject: Reset Your FindIt Password",
        "MIME-Version: 1.0",
        'Content-Type: text/html; charset="UTF-8"',
        "",
        `
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
    ].join("\r\n");

    // Encode email message for Gmail API
    const encodedMessage = Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    // Send email through Gmail API
    await gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw: encodedMessage
        }
    });
};

module.exports = { sendPasswordResetEmail };
