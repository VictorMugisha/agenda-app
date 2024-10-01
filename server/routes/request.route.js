import express from "express";
import { createRequest } from "../controllers/request.controller.js";

const router = express.Router();

router.post("/create/:id", createRequest);
router.post("/accept/:id", createRequest);

export default router;
