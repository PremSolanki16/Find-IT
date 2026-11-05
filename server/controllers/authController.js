const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

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

module.exports = { registerUser, loginUser, getCurrentUser };