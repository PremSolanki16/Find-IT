
const express = require("express");
const router = express.Router();

const {
    getConversations
} = require("../controllers/conversationController");

const authMiddleware = require("../middleware/authMiddleware");

// Get conversations for the logged-in user
router.get("/", authMiddleware, getConversations);

module.exports = router;
