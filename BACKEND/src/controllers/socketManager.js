import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let connections = {};
let messages = {};
let timeOnline = {};
let socketRooms = {};
let messageRateLimit = {};

const ConnectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST"],
            
            credentials: true
        }
    });

        io.use((socket, next) => {

            const token = socket.handshake.auth.token;
            const guestName = socket.handshake.auth.guestName;

            // Authenticated user
            if (token) {
                try {
                    const decoded = jwt.verify(
                        token,
                        process.env.JWT_SECRET
                    );

                    socket.user = decoded;
                    socket.guestName = null;

                    return next();

                } catch (error) {
                    console.error("Socket JWT error:", error);

                    return next(new Error("Invalid or expired token"));
                }
            }

            // Guest user
            if (
                typeof guestName === "string" &&
                guestName.trim().length > 0 &&
                guestName.trim().length <= 50
            ) {
                socket.user = null;
                socket.guestName = guestName.trim();

                return next();
            }

            // Neither authenticated nor valid guest
            return next(new Error("Authentication required"));
        });

    io.on("connection", (socket) => {

        socket.on("join-call", (path) => {

            if (
                typeof path !== "string" ||
                path.trim().length === 0 ||
                path.length > 100
            ) {
                socket.emit("meeting-error", "Invalid meeting code");
                return;
            }

            path = path.trim();

            if (socketRooms[socket.id] !== undefined) {
                return;
            }

            if (connections[path] === undefined) {
                connections[path] = [];
            }

            // Get users already in the meeting
            const existingUsers = [...connections[path]];

            // Remember which meeting this socket belongs to
            socketRooms[socket.id] = path;
            timeOnline[socket.id] = new Date();

            // Tell the new user who is already in the meeting
            socket.emit("user-list", existingUsers);

            // Tell existing users that a new user has joined
            for (let i = 0; i < existingUsers.length; i++) {
                io.to(existingUsers[i]).emit("user-joined", socket.id);
            }

            // Add new user to the meeting
            connections[path].push(socket.id);

            // Send previous chat messages to the new user
            if (messages[path] !== undefined) {
                for (let i = 0; i < messages[path].length; i++) {
                    io.to(socket.id).emit(
                        "chat-message",
                        messages[path][i].data,
                        messages[path][i].sender,
                        messages[path][i]["socket-id-sender"]
                    );
                }
            }
        });

        socket.on("signal", (toId, message) => {

            const senderRoom = socketRooms[socket.id];
            const receiverRoom = socketRooms[toId];

            // Sender must be in a meeting
            if (senderRoom === undefined) {
                return;
            }

            // Receiver must exist and be in the same meeting
            if (receiverRoom === undefined || receiverRoom !== senderRoom) {
                return;
            }

            io.to(toId).emit(
                "signal",
                socket.id,
                message
            );
        });

        socket.on("chat-message", (data, sender) => {

            const path = socketRooms[socket.id];

            if (path === undefined) {
                return;
            }
            const now = Date.now();

            if (!messageRateLimit[socket.id]) {
                messageRateLimit[socket.id] = [];
            }

            messageRateLimit[socket.id] =
                messageRateLimit[socket.id].filter(
                    (timestamp) => now - timestamp < 10000
                );

            if (messageRateLimit[socket.id].length >= 10) {
                return;
            }

            messageRateLimit[socket.id].push(now);

            if (
                typeof data !== "string" ||
                typeof sender !== "string"
            ) {
                return;
            }

            data = data.trim();
            sender = sender.trim();

            if (data.length === 0 || data.length > 1000) {
                return;
            }

            if (sender.length === 0 || sender.length > 100) {
                return;
            }

            if (messages[path] === undefined) {
                messages[path] = [];
            }

            messages[path].push({
                data: data,
                sender: sender,
                "socket-id-sender": socket.id
            });

            for (let i = 0; i < connections[path].length; i++) {
                io.to(connections[path][i]).emit(
                    "chat-message",
                    data,
                    sender,
                    socket.id
                );
            }
        });

        socket.on("disconnect", () => {
            const path = socketRooms[socket.id];

            if (path === undefined) {
                return;
            }

            if (connections[path] !== undefined) {
                connections[path] = connections[path].filter(
                    (id) => id !== socket.id
                );

                // Tell everyone remaining in the meeting
                for (let i = 0; i < connections[path].length; i++) {
                    io.to(connections[path][i]).emit(
                        "user-left",
                        socket.id
                    );
                }

                // Clean up empty meeting
                if (connections[path].length === 0) {
                    delete connections[path];
                    delete messages[path];
                }
            }

            delete timeOnline[socket.id];
            delete socketRooms[socket.id];
            delete messageRateLimit[socket.id];
        });
    });

    return io;
};

export default ConnectToSocket;