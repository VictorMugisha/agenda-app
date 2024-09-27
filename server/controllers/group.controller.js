import bcryptjs from "bcryptjs";
import GroupModel from "../models/group.model.js";

export async function createGroup(req, res) {
  try {
    const { name, password, confirmPassword } = req.body;
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

    const newGroup = new GroupModel({
      name,
      password: hashedPassword,
      admin: admin._id,
    });

    await newGroup.save();
    res.status(201).json(newGroup);
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
