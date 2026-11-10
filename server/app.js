const express = require("express");
const cors = require("cors");
const claimRoutes = require("./routes/claimRoutes");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const app = express();
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminRoutes = require("./routes/adminRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
// Claims Routes
app.use("/api/claims", claimRoutes);
// Conversation Routes
app.use("/api/conversations", conversationRoutes);
// Message Routes
app.use("/api/conversations", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
// Profile Routes
app.use("/api/profile", profileRoutes);

// Test API
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "FindIt Backend API is Running"
    });
});

module.exports = app;