const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getCurrentUser,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Registration route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Get current user route (protected)
router.get("/me", authMiddleware, getCurrentUser);

// Forgot password route
router.post("/forgot-password", forgotPassword);


// Reset password route
router.post("/reset-password/:token", resetPassword);

module.exports = router;