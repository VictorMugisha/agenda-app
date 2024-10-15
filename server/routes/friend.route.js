import express from "express";
import {
  getAllUsers,
  sendFriendRequest,
  handleFriendRequest,
  getPendingFriendRequests,
} from "../controllers/friend.controller.js";
import protectedRoute from "../middlewares/protect.middleware.js";

const router = express.Router();

router.get("/users", protectedRoute, getAllUsers);
router.post("/request", protectedRoute, sendFriendRequest);
router.post("/handle-request", protectedRoute, handleFriendRequest);
router.get("/pending-requests", protectedRoute, getPendingFriendRequests);

export default router;
