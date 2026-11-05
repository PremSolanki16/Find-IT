const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Routes
app.use("/api/auth", authRoutes);

// Test API
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "FindIt Backend API is Running"
    });
});

module.exports = app;