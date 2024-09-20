import express from "express";
import { getAllUsers, getSingleUser } from "../controllers/user.controller.js";
import { registerUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/new", registerUser);
router.get("/", getAllUsers)
router.get("/:id", getSingleUser)

export default router;
