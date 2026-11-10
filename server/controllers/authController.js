const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../services/emailService");

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email and password"
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            name,
            email,
            passwordHash
        });

        // Send response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accountStatus: user.accountStatus
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
};

// Login an existing user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        // Find user by email and retrieve passwordHash
        const user = await User.findOne({ email }).select("+passwordHash");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check account status
        if (user.accountStatus !== "active") {
            return res.status(403).json({
                success: false,
                message: "Your account is not active"
            });
        }

        // Compare entered password with stored hash
        const isPasswordValid = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );
        
        // Login successful
        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accountStatus: user.accountStatus
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};


// Get currently authenticated user
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.accountStatus !== "active") {
            return res.status(403).json({
                success: false,
                message: "Your account is not active"
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accountStatus: user.accountStatus,
                avatarUrl: user.avatarUrl
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user details"
        });
    }
};

// Generate a secure password reset token and send it to the user's email
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || typeof email !== "string") {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        // Return a generic response to avoid revealing registered email addresses
        const responseMessage =
            "If an account exists with this email, a password reset link will be sent.";

        if (!user) {
            return res.status(200).json({
                success: true,
                message: responseMessage
            });
        }

        // Generate a cryptographically secure reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Store only the hashed token in MongoDB
        user.passwordResetTokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Set token expiry to 15 minutes
        user.passwordResetExpiresAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const frontendUrl = process.env.CLIENT_URL;
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        try {
            await sendPasswordResetEmail(user.email, resetUrl);
        } catch (emailError) {
            // Remove the unused reset token if email delivery fails
            user.passwordResetTokenHash = undefined;
            user.passwordResetExpiresAt = undefined;
            await user.save();

            throw emailError;
        }

        return res.status(200).json({
            success: true,
            message: responseMessage
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to process password reset request"
        });
    }
};


// Verify the reset token and update the user's password
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token || typeof token !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid password reset link"
            });
        }

        if (!password || typeof password !== "string" || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // Hash the received token to match the stored token hash
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find the user with a valid, unexpired reset token
        const user = await User.findOne({
            passwordResetTokenHash: tokenHash,
            passwordResetExpiresAt: { $gt: Date.now() }
        }).select("+passwordResetTokenHash +passwordResetExpiresAt");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Password reset link is invalid or has expired"
            });
        }

        // Hash the new password before saving it
        user.passwordHash = await bcrypt.hash(password, 10);

        // Clear the reset token so it cannot be reused
        user.passwordResetTokenHash = undefined;
        user.passwordResetExpiresAt = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully. Please log in."
        });

    } catch (error) {
        console.error("Reset Password Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to reset password"
        });
    }
};


module.exports = { registerUser, loginUser, getCurrentUser, forgotPassword, resetPassword };