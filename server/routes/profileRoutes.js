
const express = require("express");
const router = express.Router();

const {
    updateProfile,
    uploadProfileImage
} = require("../controllers/profileController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Protect all profile routes
router.use(authMiddleware);

// Update profile details
router.patch("/", updateProfile);

// Upload profile picture
router.post("/upload-image", upload.single("image"), uploadProfileImage);

module.exports = router;
