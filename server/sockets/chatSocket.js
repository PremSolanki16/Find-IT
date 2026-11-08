
const jwt = require("jsonwebtoken");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// Configure authenticated real-time chat events
const chatSocket = (io) => {

    // Verify the user's JWT before connecting
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error("Authentication token is required"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;

            next();

        } catch (error) {
            next(new Error("Invalid or expired authentication token"));
        }
    });

    io.on("connection", (socket) => {

        // Join a conversation after verifying membership
        socket.on("join_conversation", async (conversationId) => {
            try {
                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    participantIds: socket.userId
                });

                if (!conversation) {
                    socket.emit("message_error", {
                        message: "You are not a participant in this conversation"
                    });
                    return;
                }

                socket.join(conversationId);

            } catch (error) {
                socket.emit("message_error", {
                    message: "Unable to join conversation"
                });
            }
        });
        // Leave a conversation room when switching chats
        socket.on("leave_conversation", (conversationId) => {
            if (typeof conversationId !== "string") {
                return;
            }

            socket.leave(conversationId);
        });
        // Save and deliver a message in real time
        socket.on("send_message", async (data) => {
            try {
                const { conversationId, text } = data || {};

                if (!conversationId || typeof text !== "string" || !text.trim()) {
                    socket.emit("message_error", {
                        message: "Valid conversation ID and message text are required"
                    });
                    return;
                }

                if (text.trim().length > 2000) {
                    socket.emit("message_error", {
                        message: "Message cannot exceed 2000 characters"
                    });
                    return;
                }

                const conversation = await Conversation.findOne({
                    _id: conversationId,
                    participantIds: socket.userId
                });

                if (!conversation) {
                    socket.emit("message_error", {
                        message: "You cannot send messages in this conversation"
                    });
                    return;
                }
                // Ensure the socket has joined this conversation
                if (!socket.rooms.has(conversationId)) {
                    socket.emit("message_error", {
                        message: "Join the conversation before sending messages"
                    });
                    return;
                }

                const message = await Message.create({
                    conversationId,
                    senderId: socket.userId,
                    text: text.trim()
                });

                conversation.lastMessageAt = message.createdAt;
                await conversation.save();

                const savedMessage = await Message.findById(message._id)
                    .populate("senderId", "name avatarUrl");

                io.to(conversationId).emit("receive_message", savedMessage);

            } catch (error) {
                console.error("Socket Send Message Error:", error);

                socket.emit("message_error", {
                    message: "Failed to send message"
                });
            }
        });

    });
};

module.exports = chatSocket;
