
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");
const chatSocket = require("./sockets/chatSocket");

const PORT = process.env.PORT || 5000;

// Create HTTP server for Express and Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.set("io", io);
// Register chat socket events
chatSocket(io);

const startServer = async () => {
    await connectDB();

    server.listen(PORT, () => {
        console.log(`FindIt Server running on port ${PORT}`);
    });
};

startServer();
