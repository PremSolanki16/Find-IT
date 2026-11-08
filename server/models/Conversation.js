const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        claimId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Claim",
            required: true,
            unique: true
        },

        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true
        },

        participantIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],

        lastMessageAt: {
            type: Date
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;