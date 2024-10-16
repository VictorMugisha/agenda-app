import mongoose from "mongoose";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import FriendModel from "../models/friend.model.js";

export async function getAllUsers(req, res) {
  try {
    const users = await UserModel.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getAllUsers controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSingleUser(req, res) {
  try {
    const { id: userId } = req.params;
    const currentUserId = req.loggedInUser._id;

    if (!mongoose.Types.ObjectId.isValid(userId) || !userId) {
      return res.status(404).json({ message: "Invalid id" });
    }

    const user = await UserModel.findById(userId)
      .select("-password")
      .populate('friends', 'firstName lastName username profilePicture')
      .populate('groupsJoined', 'name')
      .populate('groupsCreated', 'name');

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    const friendRequest = await FriendModel.findOne({
      $or: [
        { requester: currentUserId, recipient: userId },
        { requester: userId, recipient: currentUserId }
      ]
    });

    const userObj = user.toObject();
    userObj.friendStatus = friendRequest ? friendRequest.status : "none";

    res.status(200).json(userObj);
  } catch (error) {
    console.log("Error in getSingleUser controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id: userId } = req.params;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalide id provided" });
    }

    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.log("Errors in deleteUser controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProfile(req, res) {
  try {
    const user = await UserModel.findById(req.loggedInUser._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getProfile controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateProfile(req, res) {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      bio,
      profilePicture,
      currentPassword,
      newPassword,
      confirmNewPassword,
    } = req.body;

    const updates = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (bio) updates.bio = bio;
    if (profilePicture) updates.profilePicture = profilePicture;

    // Handle password update
    if (currentPassword || newPassword || confirmNewPassword) {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: "Provide all password fields" });
      }

      const user = await UserModel.findById(req.loggedInUser._id);
      const isMatch = await bcryptjs.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(newPassword, salt);
      updates.password = hashedPassword;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update!" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.loggedInUser._id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    // The user information should be available in req.loggedInUser
    // thanks to the protect middleware
    const user = req.loggedInUser;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const userId = req.loggedInUser._id;
    const user = await UserModel.findById(userId).populate('friends', 'firstName lastName username profilePicture');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error fetching user's friends:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
