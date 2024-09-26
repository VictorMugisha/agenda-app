import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

export default async function protectedRoute(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token found!" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token found. Authorization denied!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    const user = await UserModel.findById(decoded.userId).select("-password");
    
    req.loggedInUser = user;
    next();
  } catch (error) {
    console.log("Error in protectedRoute middleware: ", error);
    return res.status(500).json("Internal server error");
  }
}
