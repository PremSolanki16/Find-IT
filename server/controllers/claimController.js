const Claim = require("../models/Claim");
const Item = require("../models/Item");
const Conversation = require("../models/Conversation");

// Create a new claim for a found item
const createClaim = async (req, res) => {
    try {
        const { itemId, answers } = req.body;

        if (!itemId || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Item ID and verification answers are required"
            });
        }

        const item = await Item.findById(itemId);

        if (!item || item.status === "removed" || item.status === "closed") {
            return res.status(404).json({
                success: false,
                message: "Item not found or unavailable"
            });
        }

        if (item.type !== "found") {
            return res.status(400).json({
                success: false,
                message: "Claims can only be submitted for found items"
            });
        }

        if (item.createdBy.toString() === req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You cannot claim your own item"
            });
        }

        if (item.status !== "open") {
            return res.status(400).json({
                success: false,
                message: "This item is not currently accepting claims"
            });
        }

        // Validate every verification question and answer
        const hasInvalidAnswers = answers.some(
            (entry) =>
                !entry ||
                typeof entry.question !== "string" ||
                !entry.question.trim() ||
                typeof entry.answer !== "string" ||
                !entry.answer.trim()
        );

        if (hasInvalidAnswers) {
            return res.status(400).json({
                success: false,
                message: "Every verification question must have an answer"
            });
        }

        const existingClaim = await Claim.findOne({
            itemId,
            claimantId: req.user.id,
            status: { $in: ["pending", "accepted"] }
        });

        if (existingClaim) {
            return res.status(409).json({
                success: false,
                message: "You already have an active claim for this item"
            });
        }

        const claim = await Claim.create({
            itemId,
            claimantId: req.user.id,
            answers
        });

        item.status = "claim_pending";
        await item.save();

        return res.status(201).json({
            success: true,
            message: "Claim submitted successfully",
            claim
        });
    } catch (error) {
        console.error("Create Claim Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to submit claim"
        });
    }
};

// Get claims submitted by the logged-in user
const getMyClaims = async (req, res) => {
    try {
        const claims = await Claim.find({
            claimantId: req.user.id
        })
            .populate({
                path: "itemId",
                select: "-privateClues",
                populate: {
                    path: "createdBy",
                    select: "name email avatarUrl"
                }
            })
            .populate("claimantId", "name email avatarUrl")
            .populate("reviewedBy", "name email avatarUrl")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: claims.length,
            claims
        });
    } catch (error) {
        console.error("Get My Claims Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch your claims"
        });
    }
};

// Get claims received for items posted by the logged-in finder
const getReceivedClaims = async (req, res) => {
    try {
        const items = await Item.find({
            createdBy: req.user.id
        }).select("_id");

        const itemIds = items.map((item) => item._id);

        const claims = await Claim.find({
            itemId: { $in: itemIds }
        })
            .populate({
                path: "itemId",
                select: "-privateClues",
                populate: {
                    path: "createdBy",
                    select: "name email avatarUrl"
                }
            })
            .populate("claimantId", "name email avatarUrl")
            .populate("reviewedBy", "name email avatarUrl")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: claims.length,
            claims
        });
    } catch (error) {
        console.error("Get Received Claims Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch received claims"
        });
    }
};

// Update a claim status based on the logged-in user's permissions
const updateClaimStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const reviewNote = req.body.reviewNote ?? "";

        const allowedStatuses = [
            "accepted",
            "rejected",
            "cancelled",
            "completed"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid claim status"
            });
        }
        // Validate the review note
        if (typeof reviewNote !== "string") {
            return res.status(400).json({
                success: false,
                message: "Review note must be a string"
            });
        
        }

        // Validate the claim ID before querying MongoDB
        if (!require("mongoose").isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid claim ID"
            });
        }

        const claim = await Claim.findById(id).populate("itemId");

        if (!claim || !claim.itemId) {
            return res.status(404).json({
                success: false,
                message: "Claim not found"
            });
        }

        const isFinder =
            claim.itemId.createdBy.toString() === req.user.id;

        const isClaimant =
            claim.claimantId.toString() === req.user.id;

        const isAdmin = req.user.role === "admin";

        if (status === "cancelled") {
            if (!isClaimant || claim.status !== "pending") {
                return res.status(403).json({
                    success: false,
                    message: "You cannot cancel this claim"
                });
            }
        } else if (status === "accepted" || status === "rejected") {
            if ((!isFinder && !isAdmin) || claim.status !== "pending") {
                return res.status(403).json({
                    success: false,
                    message: "You cannot review this claim"
                });
            }
        } else if (status === "completed") {
            if ((!isFinder && !isAdmin) || claim.status !== "accepted") {
                return res.status(403).json({
                    success: false,
                    message: "Only an accepted claim can be completed by the finder"
                });
            }
        }

        claim.status = status;

        if (status === "accepted" || status === "rejected") {
            claim.reviewedBy = req.user.id;
            claim.reviewNote = reviewNote.trim();
        }

        await claim.save();

        // Create one conversation when a claim is accepted
        if (status === "accepted") {
            await Conversation.findOneAndUpdate(
                { claimId: claim._id },
                {
                    $setOnInsert: {
                        claimId: claim._id,
                        itemId: claim.itemId._id,
                        participantIds: [
                            claim.itemId.createdBy,
                            claim.claimantId
                        ]
                    }
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true
                }
            );
        }

        if (status === "completed") {
            claim.itemId.status = "returned";
            await claim.itemId.save();
        }

        if (status === "rejected" || status === "cancelled") {
            const otherActiveClaim = await Claim.findOne({
                itemId: claim.itemId._id,
                status: { $in: ["pending", "accepted"] }
            });

            if (!otherActiveClaim) {
                claim.itemId.status = "open";
                await claim.itemId.save();
            }
        }

        const updatedClaim = await Claim.findById(id)
            .populate({
                path: "itemId",
                select: "-privateClues",
                populate: {
                    path: "createdBy",
                    select: "name email avatarUrl"
                }
            })
            .populate("claimantId", "name email avatarUrl")
            .populate("reviewedBy", "name email avatarUrl");

        return res.status(200).json({
            success: true,
            message: "Claim status updated successfully",
            claim: updatedClaim
        });
    } catch (error) {
        console.error("Update Claim Status Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update claim status"
        });
    }
};

module.exports = {
    createClaim,
    getMyClaims,
    getReceivedClaims,
    updateClaimStatus
};
