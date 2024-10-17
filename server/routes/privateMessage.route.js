import express from "express";
import {
  sendPrivateMessage,
  getPrivateMessages,
  markMessageAsRead,
} from "../controllers/privateMessage.controller.js";
import protectedRoute from "../middlewares/protect.middleware.js";

const router = express.Router();

router.use(protectedRoute);

router.post("/send", sendPrivateMessage);
router.get("/:friendId", getPrivateMessages);
router.put("/:messageId/read", markMessageAsRead);

export default router;
