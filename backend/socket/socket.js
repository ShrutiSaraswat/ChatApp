import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // where userId=socketId

io.on("connection", (socket) => {
  // socket is the user that is connected
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId != "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // io.emit is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // here event name is getOnlineUsers

  // socket.on is used to listen to the events and can be used both on server and client side
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// for real-time messaging
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export { app, io, server };
