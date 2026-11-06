
const Item = require("../models/Item");

// Create a new lost or found item
const createItem = async (req, res) => {
    try {
        const {
            type,
            title,
            description,
            category,
            locationName,
            locationDetails,
            eventDate,
            imageUrls,
            privateClues,
            isRewardOffered,
            rewardDetails
        } = req.body;

        // Check required fields
        if (
            !type ||
            !title ||
            !description ||
            !category ||
            !locationName ||
            !eventDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required item details"
            });
        }

        // Validate event date
        if (isNaN(Date.parse(eventDate))) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid event date"
            });
        }

        // Create item in MongoDB
        const item = await Item.create({
            createdBy: req.user.id,
            type,
            title,
            description,
            category,
            locationName,
            locationDetails,
            eventDate,
            imageUrls,
            privateClues,
            isRewardOffered,
            rewardDetails
        });

        // Return created item without private clues
        const createdItem = await Item.findById(item._id)
            .select("-privateClues");

        res.status(201).json({
            success: true,
            message: "Item created successfully",
            item: createdItem
        });

    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create item"
        });
    }
};
// Get all items
const getAllItems = async (req, res) => {
    try {
        const items = await Item.find({ status: { $ne: "removed" } })
            .select("-privateClues")
            .populate("createdBy", "name avatarUrl")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: items.length,
            items
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch items"
        });
    }
};
// Get a single item by ID
const getItemById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find item by ID
        const item = await Item.findOne({ _id: id, status: { $ne: "removed" } })
            .select("-privateClues")
            .populate("createdBy", "name avatarUrl createdAt");

        // Check whether item exists
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        res.status(200).json({
            success: true,
            item
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid item ID"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to fetch item"
        });
    }
};

    // Get item details for editing after verifying ownership
    const getItemForEdit = async (req, res) => {
        try {
            const { id } = req.params;

            const item = await Item.findById(id);

            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: "Item not found"
                });
            }

            if (item.createdBy.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to edit this item"
                });
            }

            if (item.status !== "open") {
                return res.status(403).json({
                    success: false,
                    message: "Only open items can be edited"
                });
            }

            res.status(200).json({
                success: true,
                item
            });

        } catch (error) {
            if (error.name === "CastError") {
                return res.status(400).json({
                    success: false,
                    message: "Invalid item ID"
                });
            }

            res.status(500).json({
                success: false,
                message: "Failed to fetch item for editing"
            });
        }
    };


// Update an existing item
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        // Prevent modification of protected fields
        const protectedFields = [
            "_id",
            "createdBy",
            "type",
            "status",
            "createdAt",
            "updatedAt"
        ];

        const hasProtectedField = protectedFields.some((field) =>
            Object.prototype.hasOwnProperty.call(req.body, field)
        );

        if (hasProtectedField) {
            return res.status(400).json({
                success: false,
                message: "You cannot modify protected item fields"
            });
        }
        // Find item
        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        // Check item ownership
        if (item.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this item"
            });
        }

        // Check item status
        if (item.status !== "open") {
            return res.status(403).json({
                success: false,
                message: "Only open items can be updated"
            });
        }

        // Allowed fields
        const allowedFields = [
            "title",
            "description",
            "category",
            "locationName",
            "locationDetails",
            "eventDate",
            "imageUrls",
            "privateClues",
            "isRewardOffered",
            "rewardDetails"
        ];

        // Update only allowed fields
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                item[field] = req.body[field];
            }
        });

        // Save updated item
        await item.save();

        // Return updated item without private clues
        const updatedItem = await Item.findById(id)
            .select("-privateClues")
            .populate("createdBy", "name avatarUrl");

        res.status(200).json({
            success: true,
            message: "Item updated successfully",
            item: updatedItem
        });

    } catch (error) {
        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update item"
        });
    }
};

// Soft delete an existing item
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Find item
        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        // Check item ownership
        if (item.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this item"
            });
        }

        // Check item status
        if (item.status !== "open") {
            return res.status(403).json({
                success: false,
                message: "Only open items can be removed"
            });
        }

        // Mark item as removed
        item.status = "removed";

        await item.save();

        res.status(200).json({
            success: true,
            message: "Item removed successfully"
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid item ID"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to remove item"
        });
    }
};
module.exports = {
    createItem,
    getAllItems,
    getItemById,
    getItemForEdit,
    updateItem,
    deleteItem
};