
const { rateLimit } = require("express-rate-limit");

const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: "Too many unsuccessful login attempts. Please try again after 15 minutes."
    }
});

module.exports = loginRateLimit;
