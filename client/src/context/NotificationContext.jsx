import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback
} from "react";

import { useAuth } from "./AuthContext";

import {
    getNotificationsApi,
    markNotificationAsReadApi,
    markAllNotificationsAsReadApi
} from "../services/api";

import { createChatSocket } from "../services/chatSocket";

const NotificationContext = createContext();

// Manage notifications shared across the application
export const NotificationProvider = ({ children }) => {
    const { currentUser, isAuthenticated, isAuthLoading } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toastNotification, setToastNotification] = useState(null);

    // Display a toast for a newly received notification
    const showNotificationToast = (notification) => {
        setToastNotification(notification);
    };

    // Dismiss the current notification toast
    const dismissNotificationToast = () => {
        setToastNotification(null);
    };

    // Automatically dismiss the toast after five seconds
    useEffect(() => {
        if (!toastNotification) return;

        const timeoutId = setTimeout(() => {
            setToastNotification(null);
        }, 5000);

        return () => clearTimeout(timeoutId);
    }, [toastNotification]);

    // Fetch notifications belonging to the logged-in user
    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated) {
            setNotifications([]);
            return;
        }

        try {
            const response = await getNotificationsApi();
            setNotifications(response.notifications || []);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    }, [isAuthenticated]);

    // Load notifications when the authenticated user changes
    useEffect(() => {
        if (isAuthLoading) return;

        if (!isAuthenticated) {
            setNotifications([]);
            setToastNotification(null);
            setLoading(false);
            return;
        }

        setLoading(true);

        fetchNotifications().finally(() => {
            setLoading(false);
        });
    }, [isAuthenticated, currentUser?._id, isAuthLoading, fetchNotifications]);

    // Listen for real-time notifications from the authenticated user's socket
    useEffect(() => {
        if (isAuthLoading || !isAuthenticated) return;

        const token = localStorage.getItem("findit_token");

        if (!token) return;

        // Clear notifications belonging to a previously logged-in user
        setNotifications([]);
        setToastNotification(null);

        const socket = createChatSocket(token);

        // Handle notifications delivered to this authenticated user
        const handleNewNotification = (notification) => {
            if (!notification?._id) return;

            setNotifications((prev) => {
                // Prevent duplicate notifications
                if (prev.some((item) => item._id === notification._id)) {
                    return prev;
                }

                return [notification, ...prev];
            });

            showNotificationToast(notification);
        };

        socket.on("new_notification", handleNewNotification);
        socket.connect();

        // Remove listeners and close the connection when the user changes or logs out
        return () => {
            socket.off("new_notification", handleNewNotification);
            socket.disconnect();
        };
    }, [isAuthenticated, currentUser?._id, isAuthLoading]);

    // Mark one notification as read
    const markNotificationAsRead = async (notificationId) => {
        try {
            await markNotificationAsReadApi(notificationId);

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification._id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    // Mark all notifications as read
    const markAllNotificationsAsRead = async () => {
        try {
            await markAllNotificationsAsReadApi();

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    isRead: true
                }))
            );
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    const value = {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        toastNotification,
        showNotificationToast,
        dismissNotificationToast
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

// Access shared notification state and actions
export const useNotifications = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            "useNotifications must be used within a NotificationProvider"
        );
    }

    return context;
};

export default NotificationContext;
