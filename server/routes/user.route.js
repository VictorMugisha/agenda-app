import express from "express";
import {
  getAllUsers,
  getSingleUser,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
router.put("/:id", updateUser);

export default router;
