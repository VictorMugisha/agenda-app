import PrivateMessageModel from "../models/privateMessage.model.js";

export const sendPrivateMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.loggedInUser._id;

    console.log('From sendPrivateMessage: Sender ID:', senderId);
    console.log('From sendPrivateMessage: Recipient ID:', recipientId);
    console.log('From sendPrivateMessage: Content:', content);

    if (!senderId || !recipientId || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newMessage = new PrivateMessageModel({
      sender: senderId,
      recipient: recipientId,
      content,
    });

    await newMessage.save();
    await newMessage.populate("sender", "firstName lastName username");

    // Use the globally attached io instance
    const io = req.app.io;
    if (!io) {
      console.error('Socket.io instance not found on req.app');
      console.log('req.app keys:', Object.keys(req.app));
    } else {
      console.log(`Emitting receive_private_message to ${senderId} and ${recipientId}`);
      io.to(senderId.toString()).emit("receive_private_message", newMessage);
      io.to(recipientId.toString()).emit("receive_private_message", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendPrivateMessage:", error);
    res.status(500).json({ message: "Error sending private message", error: error.message });
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
    })
      .sort({ createdAt: 1 })
      .populate("sender", "firstName lastName username");

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
