import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

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
];

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

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
// app.get("/", (req, res) => {
//   // root route -> http://localhost:5000/
//   res.send("hello world");
// });

app.use(express.static(path.join(__dirname, "/frontend/user-side/dist")));

app.get("*", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "frontend",
      "user-side",
      "dist",
      "src",
      "app",
      "layout.js"
    )
  );
});

server.listen(PORT, () => {
  connectToDB();
  console.log(`Server running on Port ${PORT}`);
});
