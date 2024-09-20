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

    const { firstName, lastName, username, email, phoneNumber } = req.body;
    if (!firstName || !lastName || !username || !email || !phoneNumber) {
      return res.status(401).json({ message: "All fields are required" });
    }

    const newUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        username,
        email,
        phoneNumber,
      },
      {
        new: true,
        runValidators: true,
        upsert: false,
      }
    ).select("-password");

    if (!newUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(newUser);
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
