import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/:id", protectRoute, getMessages); // to get all the messages btw the current user and the user with uid-> id (the parameter in this api)

router.post("/send/:id", protectRoute, sendMessage); // before it runs the function sendMessage, 1st chk whether the user is logged in or not(protectRoute)
// basically protect this route(ie, /api/messages/send/:id), before u run the function (sendMessage)...toh basically protectRoute ek autherization process ho gaya jo hum add kr rhe hain

export default router;
