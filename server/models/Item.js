
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: ["lost", "found"],
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            enum: [
                "electronics",
                "bags",
                "clothing",
                "documents",
                "accessories",
                "keys",
                "other"
            ],
            required: true
        },

        locationName: {
            type: String,
            required: true,
            trim: true
        },

        locationDetails: {
            type: String,
            trim: true
        },

        eventDate: {
            type: Date,
            required: true
        },

        imageUrls: {
            type: [String],
            default: []
        },

        privateClues: {
            type: [String],
            default: []
        },

        status: {
            type: String,
            enum: [
                "open",
                "claim_pending",
                "returned",
                "closed",
                "removed"
            ],
            default: "open"
        },

        isRewardOffered: {
            type: Boolean,
            default: false
        },

        rewardDetails: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
