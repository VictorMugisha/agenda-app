import express from "express";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/user/:id", getSingleUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
