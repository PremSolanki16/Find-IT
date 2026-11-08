
import { io } from "socket.io-client";

// Create a Socket.IO connection using the logged-in user's token
export const createChatSocket = (token) => {
    return io("http://localhost:5000", {
        autoConnect: false,
        auth: {
            token
        }
    });
};
