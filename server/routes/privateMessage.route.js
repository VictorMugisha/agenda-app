import express from "express";
import {
  sendPrivateMessage,
  getPrivateMessages,
  markMessageAsRead,
} from "../controllers/privateMessage.controller.js";

const router = express.Router();

router.post("/send", sendPrivateMessage);
router.get("/:friendId", getPrivateMessages);
router.put("/:messageId/read", markMessageAsRead);

export default router;
