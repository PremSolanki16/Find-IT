
const Conversation = require("../models/Conversation");

// Get conversations belonging to the logged-in user
const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participantIds: req.user.id
        })
            .populate("itemId", "title type imageUrls locationName status")
            .populate("participantIds", "name avatarUrl")
            .sort({ lastMessageAt: -1, createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: conversations.length,
            conversations
        });

    } catch (error) {
        console.error("Get Conversations Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch conversations"
        });
    }
};

module.exports = {
    getConversations
};
