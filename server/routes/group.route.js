import express from "express";
import {
  createGroup,
  getAllGroups,
  getMyGroups,
  getSingleGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  checkGroupMembership,
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/new", createGroup);
router.get("/all", getAllGroups);
router.get("/mine", getMyGroups);
router.get("/group/:id", getSingleGroup);
router.put("/update/:id", updateGroup);
router.delete("/delete/:id", deleteGroup);
router.post("/join/:id", joinGroup);
router.get("/leave/:id", leaveGroup);
router.get('/:groupId/membership', checkGroupMembership);
router.get('/my-groups', getMyGroups);
router.post('/:groupId/join', joinGroup);
router.post('/:groupId/leave', leaveGroup);
router.delete('/:groupId', deleteGroup);

export default router;
