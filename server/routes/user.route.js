import express from "express";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  getProfile,
  updateProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/user/:id", getSingleUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

export default router;
