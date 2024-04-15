import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToDB from "./db/connectToDB.js";

const app = express();
const PORT = process.env.PORT || 5000;

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

app.listen(5000, () => {
  connectToDB();
  console.log(`Server running on Port ${PORT}`);
});
