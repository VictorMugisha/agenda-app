import express from "express";
import { getAllUsers, registerUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/new", registerUser);
router.get("/", getAllUsers)

export default router;
