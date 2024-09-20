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
