
const multer = require("multer");

// Store uploaded images temporarily in memory before sending them to Cloudinary
const storage = multer.memoryStorage();

// Accept only image files
const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
        callback(null, true);
    } else {
        callback(new Error("Only image files are allowed"), false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 3
    },
    fileFilter
});

module.exports = upload;
