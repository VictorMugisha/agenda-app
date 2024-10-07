import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
  getUnreadNotificationsCount
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", getNotifications);
router.put("/:id/read", markNotificationAsRead);
router.get('/unread-count', getUnreadNotificationsCount);

export default router;
