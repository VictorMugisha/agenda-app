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
} from "../controllers/group.controller.js";
import GroupModel from "../models/group.model.js";

const router = express.Router();

router.post("/new", createGroup);
router.get("/all", getAllGroups);
router.get("/mine", getMyGroups);
router.get("/group/:id", getSingleGroup);
router.put("/update/:id", updateGroup);
router.delete("/delete/:id", deleteGroup);
router.post("/join/:id", joinGroup);
router.get("/leave/:id", leaveGroup);

router.get('/:groupId/membership', async (req, res) => {
  const { groupId } = req.params;
  const userId = req.loggedInUser._id;

  try {
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = group.members.includes(userId);
    const isAdmin = group.admin.toString() === userId.toString();

    res.json({ isMember, isAdmin });
  } catch (error) {
    console.error('Error checking group membership:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
