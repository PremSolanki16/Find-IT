
const express = require("express");
const router = express.Router();

const {
    createReport,
    getAllReports,
    updateReportStatus
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Submit a report by an authenticated user
router.post("/", authMiddleware, createReport);

// Get all reports (admin only)
router.get("/", authMiddleware, adminMiddleware, getAllReports);

// Update report status (admin only)
router.patch("/:id/status", authMiddleware, adminMiddleware, updateReportStatus);

module.exports = router;
