
const mongoose = require("mongoose");

const Report = require("../models/Report");
const Item = require("../models/Item");
const User = require("../models/User");
const Message = require("../models/Message");

// Create a report after validating its target
const createReport = async (req, res) => {
    try {
        const {
            targetType,
            itemId,
            targetUserId,
            messageId,
            reason,
            details
        } = req.body;

        if (!targetType || !reason) {
            return res.status(400).json({
                success: false,
                message: "Report target and reason are required"
            });
        }

        const targetFields = {
            item: itemId,
            user: targetUserId,
            message: messageId
        };

        if (!Object.prototype.hasOwnProperty.call(targetFields, targetType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report target type"
            });
        }

        const targetId = targetFields[targetType];

        if (!targetId || !mongoose.isValidObjectId(targetId)) {
            return res.status(400).json({
                success: false,
                message: "A valid report target ID is required"
            });
        }

        if (
            details !== undefined &&
            typeof details !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Report details must be a string"
            });
        }

        let targetExists = false;

        if (targetType === "item") {
            targetExists = await Item.exists({ _id: targetId });
        } else if (targetType === "user") {
            targetExists = await User.exists({ _id: targetId });
        } else if (targetType === "message") {
            targetExists = await Message.exists({ _id: targetId });
        }

        if (!targetExists) {
            return res.status(404).json({
                success: false,
                message: "Report target not found"
            });
        }

        const reportData = {
            reporterId: req.user.id,
            targetType,
            reason,
            details
        };

        if (targetType === "item") {
            reportData.itemId = targetId;
        } else if (targetType === "user") {
            reportData.targetUserId = targetId;
        } else if (targetType === "message") {
            reportData.messageId = targetId;
        }

        const report = await Report.create(reportData);

        return res.status(201).json({
            success: true,
            message: "Report submitted successfully",
            report
        });

    } catch (error) {
        console.error("Create Report Error:", error);

        if (error.name === "ValidationError" || error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to submit report"
        });
    }
};

// Get all reports for admin review
const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate("reporterId", "name email avatarUrl")
            .populate("itemId", "title type status")
            .populate("targetUserId", "name email accountStatus")
            .populate("messageId", "text senderId conversationId")
            .populate("reviewedBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: reports.length,
            reports
        });

    } catch (error) {
        console.error("Get All Reports Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch reports"
        });
    }
};

// Update report status and admin review note
const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNote } = req.body;

        const allowedStatuses = [
            "open",
            "under_review",
            "resolved",
            "dismissed"
        ];

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report ID"
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid report status"
            });
        }

        if (
            adminNote !== undefined &&
            typeof adminNote !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Admin note must be a string"
            });
        }

        const report = await Report.findById(id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found"
            });
        }

        report.status = status;
        report.reviewedBy = req.user.id;

        if (adminNote !== undefined) {
            report.adminNote = adminNote.trim();
        }

        await report.save();

        return res.status(200).json({
            success: true,
            message: "Report status updated successfully",
            report
        });

    } catch (error) {
        console.error("Update Report Status Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update report status"
        });
    }
};

module.exports = {
    createReport,
    getAllReports,
    updateReportStatus
};
