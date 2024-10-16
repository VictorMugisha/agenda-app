import UserModel from "../models/user.model.js";
import FriendModel from "../models/friend.model.js";
import NotificationModel from "../models/notification.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.loggedInUser._id;
    const users = await UserModel.find({ _id: { $ne: currentUserId } }).select(
      "-password"
    );

    const friendRequests = await FriendModel.find({
      $or: [{ requester: currentUserId }, { recipient: currentUserId }],
      status: { $in: ["pending", "accepted"] },
    });

    const usersWithStatus = users.map((user) => {
      const userObj = user.toObject();
      const request = friendRequests.find(
        (req) =>
          (req.requester.toString() === currentUserId.toString() &&
            req.recipient.toString() === user._id.toString()) ||
          (req.recipient.toString() === currentUserId.toString() &&
            req.requester.toString() === user._id.toString())
      );

      if (request) {
        userObj.friendStatus = request.status;
        userObj.friendRequestId = request._id;
        userObj.isRequester =
          request.requester.toString() === currentUserId.toString();
      } else {
        userObj.friendStatus = "none";
      }

      return userObj;
    });

    res.status(200).json(usersWithStatus);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.loggedInUser._id;

    if (requesterId.toString() === recipientId) {
      return res
        .status(400)
        .json({ message: "You can't send a friend request to yourself" });
    }

    const existingRequest = await FriendModel.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    const newFriendRequest = new FriendModel({
      requester: requesterId,
      recipient: recipientId,
      status: "pending",
    });

    await newFriendRequest.save();

    // Create a notification for the recipient
    const notification = new NotificationModel({
      title: "New Friend Request",
      content: `You have received a new friend request from ${req.loggedInUser.firstName} ${req.loggedInUser.lastName}`,
      recipients: [recipientId],
      author: requesterId,
    });

    await notification.save();

    res.status(201).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleFriendRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;
    const userId = req.loggedInUser._id;

    const friendRequest = await FriendModel.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to handle this request" });
    }

    if (action === "accept") {
      friendRequest.status = "accepted";
      await friendRequest.save();

      // Add users to each other's friends list
      await UserModel.findByIdAndUpdate(userId, {
        $addToSet: { friends: friendRequest.requester },
      });
      await UserModel.findByIdAndUpdate(friendRequest.requester, {
        $addToSet: { friends: userId },
      });

      // Create a notification for the requester
      const notification = new NotificationModel({
        title: "Friend Request Accepted",
        content: `${req.loggedInUser.firstName} ${req.loggedInUser.lastName} has accepted your friend request`,
        recipients: [friendRequest.requester],
        author: userId,
      });

      await notification.save();

      res.status(200).json({ message: "Friend request accepted" });
    } else if (action === "decline") {
      await FriendModel.findByIdAndDelete(requestId);
      res.status(200).json({ message: "Friend request declined" });
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("Error handling friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPendingFriendRequests = async (req, res) => {
  try {
    const userId = req.loggedInUser._id;

    const pendingRequests = await FriendModel.find({
      recipient: userId,
      status: "pending",
    }).populate("requester", "firstName lastName username");

    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error("Error fetching pending friend requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFriends = async (req, res) => {
  try {
    const userId = req.loggedInUser._id;
    const user = await UserModel.findById(userId).populate(
      "friends",
      "firstName lastName username profilePicture"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error fetching user's friends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
