import express from "express";
import {
  createGroup,
  getAllGroups,
  getMyGroups,
} from "../controllers/group.controller.js";

const router = express.Router();

router.post('/new', createGroup)
router.get('/all', getAllGroups)
router.get("/mine", getMyGroups);

export default router;
