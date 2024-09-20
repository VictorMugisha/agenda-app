import bcryptjs from "bcryptjs";
import UserModel from "../models/user.model.js";

export async function registerUser(req, res) {
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

    if (
      !firstName ||
      !lastName ||
      !email ||
      !username ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

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

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      username,
      phoneNumber,
      password: hashedPassword,
      isAdmin,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.log("Error in registerUser controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
