const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

// Test API
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "FindIt Backend API is Running"
    });
});

module.exports = app;