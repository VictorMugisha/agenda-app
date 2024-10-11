import MessageModel from "../models/message.model.js";
import GroupModel from "../models/group.model.js";
import mongoose from 'mongoose';

export async function getMessages(req, res) {
  try {
    const { groupId } = req.params;
    const userId = req.loggedInUser._id;
    
    if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    const messages = await MessageModel.find({ group: groupId })
      .sort({ createdAt: 1 })
      .populate("sender", "firstName lastName username")
      .populate("readBy", "firstName lastName");

    // Mark messages as read
    await MessageModel.updateMany(
      { group: groupId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendMessage(req, res) {
  try {
    const { groupId } = req.params;
    const { content } = req.body;
    const senderId = req.loggedInUser._id;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.includes(senderId)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this group" });
    }

    const newMessage = new MessageModel({
      content,
      sender: senderId,
      group: groupId,
    });

    await newMessage.save();
    await newMessage.populate("sender", "firstName lastName username");

    // Emit the new message to all users in the group
    req.app.get('io').to(groupId).emit('receive_message', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
