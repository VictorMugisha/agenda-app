import express from "express";
import {
  createGroup,
  getAllGroups,
  getMyGroups,
  getSingleGroup,
  updateGroup,
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/new", createGroup);
router.get("/all", getAllGroups);
router.get("/mine", getMyGroups);
router.get("/:id", getSingleGroup);
router.put("/:id", updateGroup);

export default router;
