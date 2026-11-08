
const express = require("express");
const router = express.Router();

const {
    getMessages,
    sendMessage
} = require("../controllers/messageController");

const authMiddleware = require("../middleware/authMiddleware");

// Get messages for a conversation
router.get("/:id/messages", authMiddleware, getMessages);

// Send a message in a conversation
router.post("/:id/messages", authMiddleware, sendMessage);

module.exports = router;
