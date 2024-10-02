import express from "express";
import {
  acceptRequest,
  createRequest,
  getRequestDetails,
} from "../controllers/request.controller.js";

const router = express.Router();

router.post("/create/:id", createRequest);
router.post("/accept/:id", acceptRequest);
router.get("/:id", getRequestDetails);

export default router;
