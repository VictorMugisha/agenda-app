import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import groupRoutes from "./routes/group.route.js";
import requestRoutes from "./routes/request.route.js";
import protectedRoute from "./middlewares/protect.middleware.js";
import messageRoutes from "./routes/message.route.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const PORT = process.env.PORT || 8000;
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", protectedRoute, userRoutes);
app.use("/api/groups", protectedRoute, groupRoutes);
app.use("/request", protectedRoute, requestRoutes);
app.use("/api/messages", messageRoutes);

// Serve the frontend client (React app)
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  return res.sendFile(path.join(__dirname, "/client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
