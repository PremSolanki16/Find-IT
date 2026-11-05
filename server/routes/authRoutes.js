const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getCurrentUser
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Registration route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Get current user route (protected)
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;