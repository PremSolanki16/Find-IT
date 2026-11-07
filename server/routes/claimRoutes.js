
const express = require("express");
const router = express.Router();

const {
    createClaim,
    getMyClaims,
    getReceivedClaims,
    updateClaimStatus
} = require("../controllers/claimController");

const authMiddleware = require("../middleware/authMiddleware");

// Submit a new claim
router.post("/", authMiddleware, createClaim);

// Get claims submitted by the logged-in user
router.get("/my", authMiddleware, getMyClaims);

// Get claims received by the logged-in finder
router.get("/received", authMiddleware, getReceivedClaims);

// Update a claim status
router.patch("/:id/status", authMiddleware, updateClaimStatus);

module.exports = router;
