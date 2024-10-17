import PrivateMessageModel from "../models/privateMessage.model.js";
import UserModel from "../models/user.model.js";

export const sendPrivateMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.loggedInUser._id;

    const newMessage = new PrivateMessageModel({
      sender: senderId,
      recipient: recipientId,
      content,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending private message", error: error.message });
  }
};

export const getPrivateMessages = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.loggedInUser._id;

    const messages = await PrivateMessageModel.find({
      $or: [
        { sender: userId, recipient: friendId },
        { sender: friendId, recipient: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching private messages",
        error: error.message,
      });
  }
};

export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await PrivateMessageModel.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(message);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking message as read", error: error.message });
  }
};
