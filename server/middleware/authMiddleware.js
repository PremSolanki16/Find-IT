
const jwt = require("jsonwebtoken");

// Verify JWT token before allowing access to protected routes
const authMiddleware = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is required"
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token using secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store decoded user information in request
        req.user = decoded;

        // Allow request to continue
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token"
        });
    }
};

module.exports = authMiddleware;
