const mongoose = require("mongoose");
const Notification = require("../models/Notification");

// Get notifications belonging to the logged-in user
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipientId: req.user.id
        }).sort({ createdAt: -1 });

        const unreadCount = await Notification.countDocuments({
            recipientId: req.user.id,
            isRead: false
        });

        return res.status(200).json({
            success: true,
            count: notifications.length,
            unreadCount,
            notifications
        });

    } catch (error) {
        console.error("Get Notifications Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });
    }
};

// Mark one notification as read after checking ownership
const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID"
            });
        }

        const notification = await Notification.findOneAndUpdate(
            {
                _id: id,
                recipientId: req.user.id
            },
            {
                isRead: true
            },
            {
                new: true
            }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            notification
        });

    } catch (error) {
        console.error("Mark Notification Read Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update notification"
        });
    }
};

// Mark all notifications belonging to the logged-in user as read
const markAllNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                recipientId: req.user.id,
                isRead: false
            },
            {
                isRead: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });

    } catch (error) {
        console.error("Mark All Notifications Read Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update notifications"
        });
    }
};

module.exports = {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
};