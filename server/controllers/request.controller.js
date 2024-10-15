import mongoose from "mongoose";
import GroupModel from "../models/group.model.js";
import RequestModel from "../models/request.model.js";
import UserModel from "../models/user.model.js";
import NotificationModel from "../models/notification.model.js";

export async function createRequest(req, res) {
  try {
    const { id: groupId } = req.params;
    const { _id: userId } = req.loggedInUser;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group doesn't exist" });
    }

    if (group.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already a member of this group" });
    }

    if (group.admin.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "You are the admin of this group" });
    }

    const pendingRequest = await RequestModel.findOne({
      group: groupId,
      user: userId,
    });
    if (pendingRequest) {
      return res
        .status(400)
        .json({ message: "You already have a pending request" });
    }

    const groupAdmin = group.admin;

    const request = new RequestModel({
      user: userId,
      group: groupId,
      groupAdmin: groupAdmin,
    });

    // Create notification for group admin
    const loggedInUserDetails = await UserModel.findById(userId).select(
      "-password"
    );

    const notification = new NotificationModel({
      title: "New request",
      content: `${loggedInUserDetails.firstName} ${loggedInUserDetails.lastName} has requested to join your group ${group.name}`,
      group: groupId,
      author: userId,
      recipients: [groupAdmin],
      isRead: false,
    });

    await notification.save(notification);
    
    const userNotification = new NotificationModel({
      title: "Join Request Pending",
      content: `Your request to join the group "${group.name}" is pending. You'll be notified when the admin responds.`,
      group: groupId,
      author: userId,
      recipients: [userId],
      isRead: false,
    });

    await userNotification.save();

    await request.save();

    res.status(201).json({
      message: "Request created successfully",
      request: request,
    });
  } catch (error) {
    console.log("Error in createRequest controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  console.log(req.body);
}

export async function acceptRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const { _id: userId } = req.loggedInUser;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const request = await RequestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request doesn't exist" });
    }

    if (request.groupAdmin.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ message: "You are not authorized to accept this request" });
    }

    const group = await GroupModel.findById(request.group);
    if (!group) {
      return res.status(404).json({ message: "Group doesn't exist" });
    }

    const updatedGroup = await GroupModel.findByIdAndUpdate(
      group._id,
      {
        $push: { members: userId },
      },
      {
        new: true,
        runValidators: true,
        upsert: false,
      }
    );

    await RequestModel.findByIdAndUpdate(
      requestId,
      {
        $set: { status: "accepted" },
      },
      {
        new: true,
        runValidators: true,
        upsert: false,
      }
    );

    // Delete the join request notification
    await NotificationModel.deleteOne({
      title: "New Join Request",
      group: group._id,
      recipients: userId,
    });

    // Create notification for user
    const loggedInUserDetails = await UserModel.findById(userId).select(
      "-password"
    );
    const userNotification = {
      title: "Request Accepted",
      content: `Your request to join the group ${group.name} has been accepted by ${loggedInUserDetails.firstName} ${loggedInUserDetails.lastName}`,
      group: group._id,
      author: userId,
      recipients: [request.user],
      isRead: false,
    };

    await NotificationModel.create(userNotification);

    // Adding the group to the user
    await UserModel.findByIdAndUpdate(
      request.user,
      {
        $push: { groupsJoined: group._id },
      },
      {
        new: true,
        runValidators: true,
        upsert: false,
      }
    );

    res.status(200).json({
      message: "Request accepted successfully",
      group: updatedGroup,
    });
  } catch (error) {
    console.log("Error in acceptRequest controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getRequestDetails(req, res) {
  try {
    const { id: requestId } = req.params;
    const { _id: userId } = req.loggedInUser;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const request = await RequestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request doesn't exist" });
    }

    if (request.users.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ message: "You are not authorized to view this request" });
    }

    res.status(200).json({
      message: "Request details fetched successfully",
      request: request,
    });
  } catch (error) {
    console.log("Error in getRequestDetails controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
