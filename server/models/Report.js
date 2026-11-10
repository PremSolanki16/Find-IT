
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        reporterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        targetType: {
            type: String,
            enum: ["item", "user", "message"],
            required: true
        },

        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        },

        targetUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        messageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        },

        reason: {
            type: String,
            enum: [
                "spam",
                "inappropriate",
                "scam",
                "harassment",
                "other"
            ],
            required: true
        },

        details: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "open",
                "under_review",
                "resolved",
                "dismissed"
            ],
            default: "open"
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        adminNote: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
