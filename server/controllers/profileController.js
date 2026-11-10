
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// Update the authenticated user's profile details
const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid name"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.name = name.trim();
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accountStatus: user.accountStatus,
                avatarUrl: user.avatarUrl
            }
        });

    } catch (error) {
        console.error("Update Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
};


// Upload the authenticated user's profile picture to Cloudinary
const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select a profile image"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "findit/profiles",
                    resource_type: "image"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            uploadStream.end(req.file.buffer);
        });

        user.avatarUrl = uploadResult.secure_url;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile picture uploaded successfully",
            avatarUrl: user.avatarUrl
        });

    } catch (error) {
        console.error("Profile Image Upload Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to upload profile picture"
        });
    }
};

module.exports = {
    updateProfile,
    uploadProfileImage
};
