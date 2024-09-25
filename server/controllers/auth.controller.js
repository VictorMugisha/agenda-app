import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
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
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.log("Error in registerUser controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await UserModel.findOne({
      $or: [
        { email: username },
        { username: username },
        { phoneNumber: username },
      ],
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password!" });
    }

    const passwordCheck = await bcryptjs.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(401).json({ message: "Invalid username or password!" });
    }

    const payload = {
      userId: user._id,
      username: user.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("agenda_token", token, {
      sameSite: "strict",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({ message: "Login Successful" });
  } catch (error) {
    console.log("Error in loginUser controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function verifyToken(req, res) {
  try {
    const token = req.cookies.agenda_token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
      return res.status(200).json({ message: "Token is valid" });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function logoutUser(req, res) {
  try {
    res.clearCookie("agenda_token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.log("Error in logoutUser controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
