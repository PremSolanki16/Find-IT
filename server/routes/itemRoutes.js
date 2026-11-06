const express = require("express");
const router = express.Router();
const {
    createItem,
    getAllItems,
    getItemById,
    getItemForEdit,
    updateItem,
    deleteItem
} = require("../controllers/itemController");

const authMiddleware = require("../middleware/authMiddleware");

// Create a new lost or found item (protected)
router.post("/", authMiddleware, createItem);
// Get all items (public)
router.get("/", getAllItems);
// Get item details for editing (protected)
router.get("/:id/edit", authMiddleware, getItemForEdit);
// Get a single item by ID (public)
router.get("/:id", getItemById);
// Update an existing item (protected)
router.patch("/:id", authMiddleware, updateItem);
// Delete an existing item (protected)
router.delete("/:id", authMiddleware, deleteItem);
module.exports = router;