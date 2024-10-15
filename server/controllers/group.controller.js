import mongoose from "mongoose";
import GroupModel from "../models/group.model.js";
import UserModel from "../models/user.model.js";
import RequestModel from "../models/request.model.js";
import NotificationModel from "../models/notification.model.js";

export async function createGroup(req, res) {
  try {
    const { name, description, coverImg } = req.body;
    const admin = req.loggedInUser;

    if (!name) {
      return res.status(400).json({ message: "A group must have a name!" });
    }

    const existingGroup = await GroupModel.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: "Group already exists" });
    }

    const fields = {};

    if (description) fields.description = description;
    if (coverImg) fields.coverImg = coverImg;

    fields.admin = admin._id;
    fields.members = [admin._id];
    fields.name = name;

    const newGroup = new GroupModel(fields);

    // Add group to the user
    const user = await UserModel.findByIdAndUpdate(
      admin._id,
      {
        $push: {
          groupsCreated: newGroup._id,
          groupsJoined: newGroup._id,
        },
      },
      { new: true, runValidators: true, upsert: false }
    );

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    await newGroup.save();

    const savedGroup = await GroupModel.findById(newGroup._id).populate({
      path: "admin",
      select: "-password",
    });
    res.status(201).json(savedGroup);
  } catch (error) {
    console.log("Error in createGroup controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllGroups(req, res) {
  try {
    const allGroups = await GroupModel.find()
      .populate({
        path: "admin",
        select: "-password",
      })
      .populate({
        path: "members",
        select: "-password",
      });
    res.status(200).json(allGroups);
  } catch (error) {
    console.log("Error in getAllGroups controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMyGroups(req, res) {
  try {
    const userId = req.loggedInUser._id;
    const myGroups = await GroupModel.find({ members: userId })
      .populate("admin", "firstName lastName username")
      .populate("members", "firstName lastName username")
      .select("-announcements"); // Exclude announcements if not needed

    res.status(200).json(myGroups);
  } catch (error) {
    console.error("Error in getMyGroups controller:", error);
    res.status(500).json({ message: "Failed to fetch your groups" });
  }
}

export async function getSingleGroup(req, res) {
  try {
    const { id } = req.params;
    const group = await GroupModel.findById(id)
      .populate("admin", "firstName lastName username")
      .populate("members", "firstName lastName username")
      .populate("announcements");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.log("Error in getSingleGroup controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.loggedInUser._id;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already a member of this group" });
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    console.error("Error in joinGroup controller:", error);
    res.status(500).json({ message: "Failed to join the group" });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.loggedInUser._id;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are not a member of this group" });
    }

    group.members = group.members.filter(
      (memberId) => memberId.toString() !== userId.toString()
    );
    await group.save();

    res.status(200).json({ message: "Successfully left the group" });
  } catch (error) {
    console.error("Error in leaveGroup controller:", error);
    res.status(500).json({ message: "Failed to leave the group" });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.loggedInUser._id;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.admin.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only the group admin can delete the group" });
    }

    await GroupModel.findByIdAndDelete(groupId);

    res.status(200).json({ message: "Group successfully deleted" });
  } catch (error) {
    console.error("Error in deleteGroup controller:", error);
    res.status(500).json({ message: "Failed to delete the group" });
  }
};

export const checkGroupMembership = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.loggedInUser._id;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.includes(userId);
    const isAdmin = group.admin.toString() === userId.toString();

    // Check for pending request
    const pendingRequest = await RequestModel.findOne({
      group: groupId,
      user: userId,
      status: "pending",
    });

    res.json({
      isMember,
      isAdmin,
      hasPendingRequest: !!pendingRequest,
    });
  } catch (error) {
    console.error("Error checking group membership:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getGroupRequests = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.loggedInUser._id;

    const group = await GroupModel.findById(groupId);
    if (!group || group.admin.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view requests for this group" });
    }

    const requests = await RequestModel.find({
      group: groupId,
      status: "pending",
    }).populate("user", "firstName lastName username");
    res.json(requests);
  } catch (error) {
    console.error("Error fetching group requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleJoinRequest = async (req, res) => {
  try {
    const { groupId, requestId, action } = req.params;
    const userId = req.loggedInUser._id;

    const group = await GroupModel.findById(groupId);
    if (!group || group.admin.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to handle requests for this group" });
    }

    const request = await RequestModel.findById(requestId);
    if (!request || request.group.toString() !== groupId) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (action === "accept") {
      await GroupModel.findByIdAndUpdate(groupId, {
        $addToSet: { members: request.user },
      });
      request.status = "accepted";

      // Create notification for accepted request
      const acceptNotification = new NotificationModel({
        title: "Join Request Accepted",
        content: `Your request to join the group "${group.name}" has been accepted by ${admin.firstName} ${admin.lastName}.`,
        group: groupId,
        author: userId,
        recipients: [request.user],
        isRead: false,
      });
      await acceptNotification.save();

      // Add group to user's groupsJoined
      await UserModel.findByIdAndUpdate(request.user, {
        $addToSet: { groupsJoined: groupId },
      });
    } else if (action === "reject") {
      request.status = "rejected";

      // Create notification for rejected request
      const rejectNotification = new NotificationModel({
        title: "Join Request Rejected",
        content: `Your request to join the group "${group.name}" has been rejected by ${admin.firstName} ${admin.lastName}.`,
        group: groupId,
        author: userId,
        recipients: [request.user],
        isRead: false,
      });
      await rejectNotification.save();
      
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await request.save();
    res.json({ message: `Request ${action}ed successfully` });
  } catch (error) {
    console.error("Error handling join request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description, coverImg } = req.body;
    const userId = req.loggedInUser._id;

    const group = await GroupModel.findById(groupId);
    if (!group || group.admin.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this group" });
    }

    const updatedGroup = await GroupModel.findByIdAndUpdate(
      groupId,
      { name, description, coverImg },
      { new: true, runValidators: true }
    );

    res.json(updatedGroup);
  } catch (error) {
    console.error("Error updating group details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.loggedInUser._id;

    const group = await GroupModel.findById(groupId).populate({
      path: "members",
      select: "-password",
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (
      !group.members.some(
        (member) => member._id.toString() === userId.toString()
      )
    ) {
      return res.status(403).json({
        message: "You must be a member of the group to view its members",
      });
    }

    const membersWithAdminStatus = group.members.map((member) => ({
      ...member.toObject(),
      isAdmin: group.admin.toString() === member._id.toString(),
    }));

    res.status(200).json(membersWithAdminStatus);
  } catch (error) {
    console.error("Error fetching group members:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeMemberFromGroup = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const adminId = req.loggedInUser._id;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.admin.toString() !== adminId.toString()) {
      return res
        .status(403)
        .json({ message: "Only the group admin can remove members" });
    }

    if (group.admin.toString() === memberId) {
      return res
        .status(400)
        .json({ message: "Admin cannot be removed from the group" });
    }

    if (!group.members.includes(memberId)) {
      return res
        .status(400)
        .json({ message: "User is not a member of this group" });
    }

    group.members = group.members.filter((id) => id.toString() !== memberId);
    await group.save();

    // Remove the group from the user's groupsJoined array
    await UserModel.findByIdAndUpdate(memberId, {
      $pull: { groupsJoined: groupId },
    });

    const admin = await UserModel.findById(adminId).select(
      "firstName lastName"
    );
    const notification = new NotificationModel({
      title: "Removed from Group",
      content: `You have been removed from the group "${group.name}" by ${admin.firstName} ${admin.lastName}.`,
      group: groupId,
      author: adminId,
      recipients: [memberId],
      isRead: false,
    });

    await notification.save();

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Error removing member from group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};