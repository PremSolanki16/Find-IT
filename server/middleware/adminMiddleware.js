
const User = require("../models/User");

// Allow access only to active administrator accounts
const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user || user.accountStatus !== "active") {
            return res.status(403).json({
                success: false,
                message: "Your account is not active"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access is required"
            });
        }

        next();

    } catch (error) {
        console.error("Admin Authorization Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to verify admin permissions"
        });
    }
};

module.exports = adminMiddleware;
