const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: [
                "claim_received",
                "claim_accepted",
                "claim_rejected",
                "new_message",
                "item_update"
            ],
            required: true
        },

        title: {
            type: String,
            required: true
        },

        body: {
            type: String,
            required: true
        },

        relatedItemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        },

        relatedClaimId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Claim"
        },

        relatedConversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation"
        },

        isRead: {
            type: Boolean,
            default: false
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        versionKey: false
    }
);

// Index notifications for efficient recipient and unread queries
notificationSchema.index({
    recipientId: 1,
    isRead: 1,
    createdAt: -1
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;