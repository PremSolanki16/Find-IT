
const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// Get messages after verifying conversation membership
const getMessages = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation ID"
            });
        }

        const conversation = await Conversation.findOne({
            _id: id,
            participantIds: req.user.id
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        const messages = await Message.find({
            conversationId: id
        })
            .populate("senderId", "name avatarUrl")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: messages.length,
            messages
        });

    } catch (error) {
        console.error("Get Messages Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch messages"
        });
    }
};

// Send a message after verifying conversation membership
const sendMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation ID"
            });
        }

        if (typeof text !== "string" || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message text is required"
            });
        }

        if (text.trim().length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Message cannot exceed 2000 characters"
            });
        }

        const conversation = await Conversation.findOne({
            _id: id,
            participantIds: req.user.id
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            });
        }

        const message = await Message.create({
            conversationId: conversation._id,
            senderId: req.user.id,
            text: text.trim()
        });

        conversation.lastMessageAt = message.createdAt;
        await conversation.save();

        const savedMessage = await Message.findById(message._id)
            .populate("senderId", "name avatarUrl");

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: savedMessage
        });

    } catch (error) {
        console.error("Send Message Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send message"
        });
    }
};

module.exports = {
    getMessages,
    sendMessage
};
