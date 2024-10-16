import express from "express";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  getProfile,
  updateProfile,
  getCurrentUser,
  getUserFriends,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/user/:id", getSingleUser);
router.delete("/delete/:id", deleteUser); 
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/me", getCurrentUser);
router.get("/friends", getUserFriends);

export default router;
