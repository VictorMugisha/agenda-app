import express from "express";
import {
  createGroup,
  getAllGroups,
  getMyGroups,
  getSingleGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  checkGroupMembership,
  getGroupRequests,
  handleJoinRequest,
  updateGroupDetails,
  getGroupMembers,
  removeMemberFromGroup
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/new", createGroup);
router.get("/all", getAllGroups);
router.get("/group/:id", getSingleGroup);
router.get('/:groupId/membership/', checkGroupMembership);
router.get('/my-groups', getMyGroups);
router.post('/:groupId/join', joinGroup);
router.post('/:groupId/leave', leaveGroup);
router.delete('/:groupId', deleteGroup);
router.get('/:groupId/requests', getGroupRequests);
router.post('/:groupId/requests/:requestId/:action', handleJoinRequest);
router.put('/:groupId', updateGroupDetails);
router.get('/:groupId/members', getGroupMembers);
router.post("/:groupId/remove-member/:memberId", removeMemberFromGroup);

export default router;
