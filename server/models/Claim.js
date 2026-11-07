
const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true
        },

        claimantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        answers: [
            {
                question: {
                    type: String,
                    required: true
                },

                answer: {
                    type: String,
                    required: true
                }
            }
        ],

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "rejected",
                "cancelled",
                "completed"
            ],
            default: "pending"
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        reviewNote: {
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Claim = mongoose.model("Claim", claimSchema);

module.exports = Claim;
