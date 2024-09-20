import express from "express";
import UserModel from "../models/user.model.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      username,
      phoneNumber,
      password,
      confirmPassword,
      isAdmin,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await UserModel.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (phoneNumber.length !== 10) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits" });
    }

    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      username,
      phoneNumber,
      password,
      isAdmin,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {}
});
