import express from "express";
import {
  getAllUsers,
  sendFriendRequest,
  handleFriendRequest,
  getPendingFriendRequests,
  getFriends,
} from "../controllers/friend.controller.js";

const router = express.Router();

router.get("/", getFriends);
router.get("/users", getAllUsers);
router.post("/request", sendFriendRequest);
router.post("/handle-request", handleFriendRequest);
router.get("/pending-requests", getPendingFriendRequests);

export default router;
