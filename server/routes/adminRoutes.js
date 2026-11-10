
const express = require("express");
const router = express.Router();

const {
    getAdminOverview,
    getAllUsers,
    updateUserStatus,
    getAllAdminItems,
    removeAdminItem,
    getAllAdminClaims
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Protect all admin routes
router.use(authMiddleware, adminMiddleware);

// Get admin dashboard statistics
router.get("/overview", getAdminOverview);

// Get all registered users
router.get("/users", getAllUsers);

// Update user account status
router.patch("/users/:id/status", updateUserStatus);

// Get all item postings
router.get("/items", getAllAdminItems);

// Remove an item posting
router.patch("/items/:id/remove", removeAdminItem);

// Get all claims
router.get("/claims", getAllAdminClaims);

module.exports = router;
