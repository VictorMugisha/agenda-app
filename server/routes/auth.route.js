import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyToken,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/verify-token", verifyToken);
router.post("/logout", logoutUser)

export default router;
