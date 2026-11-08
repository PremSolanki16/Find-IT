const express = require("express");
const cors = require("cors");
const claimRoutes = require("./routes/claimRoutes");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const app = express();
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
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

// Test API
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "FindIt Backend API is Running"
    });
});

module.exports = app;