import bcryptjs from "bcryptjs";
import GroupModel from "../models/group.model.js";
import mongoose from "mongoose";

export async function createGroup(req, res) {
  try {
    const { name, description, coverImg, password, confirmPassword } = req.body;
    const admin = req.loggedInUser;

    if (!name || !password || !confirmPassword) {
      return res.status(400).json({ message: "Provide a name and password" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingGroup = await GroupModel.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: "Group already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const fields = {};

    if (description) fields.description = description;
    if (coverImg) fields.coverImg = coverImg;

    fields.admin = admin._id;
    fields.members = [admin._id];
    fields.name = name;
    fields.password = hashedPassword;

    const newGroup = new GroupModel(fields);

    await newGroup.save();

    const savedGroup = await GroupModel.findById(newGroup._id).select(
      "-password"
    );
    res.status(201).json(savedGroup);
  } catch (error) {
    console.log("Error in createGroup controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllGroups(req, res) {
  try {
    const allGroups = await GroupModel.find().select("-password");
    res.status(200).json(allGroups);
  } catch (error) {
    console.log("Error in getAllGroups controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMyGroups(req, res) {
  try {
    const myGroups = await GroupModel.find({ admin: req.loggedInUser._id });
    res.status(200).json(myGroups);
  } catch (error) {
    console.log("Error in getMyGroups controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSingleGroup(req, res) {
  try {
    const { id } = req.params;
    const group = await GroupModel.findById(id).select("-password");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.log("Error in getSingleGroup controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateGroup(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      currentPassword,
      newPassword,
      confirmNewPassword,
      description,
      coverImg,
    } = req.body;
    const admin = req.loggedInUser;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const group = await GroupModel.findById(id);
    if (!group) {
      return res.status(400).json({ message: "Group doesn't exist" });
    }

    if (group.admin.toString() !== admin._id.toString()) {
      return res.status(401).json({ message: "You cannot update this group" });
    }

    const updates = {};

    if (name) updates.name = name;
    if (description) updates.description = description;
    if (coverImg) updates.coverImg = coverImg;

    if (currentPassword || newPassword || confirmNewPassword) {
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: "Provide all password fields" });
      }

      const isMatch = await bcryptjs.compare(currentPassword, group.password);
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

    const updatedGroup = await GroupModel.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
        upsert: false,
      }
    ).select("-password");

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.log("Error in updateGroup controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
