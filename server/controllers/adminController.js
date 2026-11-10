
const mongoose = require("mongoose");

const User = require("../models/User");
const Item = require("../models/Item");
const Claim = require("../models/Claim");

// Get statistics for the admin dashboard
const getAdminOverview = async (req, res) => {
    try {
        const [
            totalUsers,
            totalPosts,
            totalClaims,
            completedReturns
        ] = await Promise.all([
            User.countDocuments(),
            Item.countDocuments(),
            Claim.countDocuments(),
            Claim.countDocuments({ status: "completed" })
        ]);

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalPosts,
                totalClaims,
                completedReturns
            }
        });

    } catch (error) {
        console.error("Admin Overview Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin dashboard statistics"
        });
    }
};

// Get all registered users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-passwordHash")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get All Users Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

// Update a user's account status
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { accountStatus } = req.body;

        const allowedStatuses = ["active", "suspended", "disabled"];

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        if (!allowedStatuses.includes(accountStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account status"
            });
        }

        if (id === req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You cannot change your own account status"
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.accountStatus = accountStatus;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User account status updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accountStatus: user.accountStatus
            }
        });

    } catch (error) {
        console.error("Update User Status Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update user account status"
        });
    }
};

// Get all item postings for admin moderation
const getAllAdminItems = async (req, res) => {
    try {
        const items = await Item.find()
            .select("-privateClues")
            .populate("createdBy", "name email avatarUrl")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: items.length,
            items
        });

    } catch (error) {
        console.error("Get Admin Items Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch item postings"
        });
    }
};

// Remove an item posting through admin moderation
const removeAdminItem = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid item ID"
            });
        }

        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        if (item.status === "removed") {
            return res.status(400).json({
                success: false,
                message: "Item has already been removed"
            });
        }

        item.status = "removed";
        await item.save();

        return res.status(200).json({
            success: true,
            message: "Item removed successfully"
        });

    } catch (error) {
        console.error("Admin Remove Item Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove item"
        });
    }
};

// Get all claims for admin auditing
const getAllAdminClaims = async (req, res) => {
    try {
        const claims = await Claim.find()
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
        console.error("Get Admin Claims Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch claims"
        });
    }
};

module.exports = {
    getAdminOverview,
    getAllUsers,
    updateUserStatus,
    getAllAdminItems,
    removeAdminItem,
    getAllAdminClaims
};
