import mongoose from "mongoose";
import UserModel from "../models/user.model.js";

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
    if (!mongoose.Types.ObjectId.isValid(userId) || !userId) {
      return res.status(404).json({ message: "Invalid id" });
    }

    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getSingleUser controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateUser(req, res) {
  try {
    const { id: userId } = req.params;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid id provided" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const {
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
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
    if (profilePicture) updates.profilePicture = profilePicture;

    if (currentPassword || newPassword || confirmNewPassword) {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: "Provide all password fields" });
      }

      const isMatch = await bcryptjs.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      updates.password = hashedPassword;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update!" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
        upsert: false,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateUser controller: ", error);
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
