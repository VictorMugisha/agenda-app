import express from "express";
import {
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";
import protectedRoute from "../middlewares/protect.middleware.js";

const router = express.Router();

router.get("/", protectedRoute, getNotifications);
router.put("/:id/read", protectedRoute, markNotificationAsRead);

export default router;
