import express from "express";
import {
  getMessages,
  sendMessage,
  deleteMessage,
} from "../controllers/message.controller.js";
import protectedRoute from "../middlewares/protect.middleware.js";

const router = express.Router();

// Get messages for a specific group
router.get("/:groupId", protectedRoute, getMessages);

// Send a new message to a group
router.post("/:groupId", protectedRoute, sendMessage);

// Delete a message
router.delete("/:messageId", protectedRoute, deleteMessage);

export default router;
