import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToDB from "./db/connectToDB.js";
import cors from "cors";
import bodyParser from "body-parser";
import { app, server } from "./socket/socket.js";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "https://chat-app-eight-umber.vercel.app/login",
];

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);

// Increase the payload limit, for managing the file uplaod limit, bcz sometimes error was coming in the console, that payloadSizeTooLarge, when images were uploaded
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

dotenv.config();

app.use(express.json()); // to parse the incoming requests from json payload(from req.body) // middleware-1
app.use(cookieParser()); // to parse/access the incoming cookies from req.cookie // middileware-2

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.send("hello world");
});

server.listen(PORT, () => {
  connectToDB();
  console.log(`Server running on Port ${PORT}`);
});
