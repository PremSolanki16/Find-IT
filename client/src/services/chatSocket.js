
import { io } from "socket.io-client";

// Create a Socket.IO connection using the logged-in user's token
export const createChatSocket = (token) => {
    return io(import.meta.env.VITE_API_URL, {
        autoConnect: false,
        auth: {
            token
        }
    });
};
