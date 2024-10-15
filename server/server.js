import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import MessageModel from "./models/message.model.js";
import GroupModel from "./models/group.model.js";

import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import groupRoutes from "./routes/group.route.js";
import requestRoutes from "./routes/request.route.js";
import protectedRoute from "./middlewares/protect.middleware.js";
import messageRoutes from "./routes/message.route.js";
import notificationRoutes from "./routes/notification.route.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const PORT = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://victor-agenda-app.onrender.com",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://victor-agenda-app.onrender.com",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", protectedRoute, userRoutes);
app.use("/api/groups", protectedRoute, groupRoutes);
app.use("/api/request", protectedRoute, requestRoutes);
app.use("/api/messages", protectedRoute, messageRoutes);
app.use("/api/notifications", protectedRoute, notificationRoutes);

// Serve the frontend client (React app)
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  return res.sendFile(path.join(__dirname, "/client/dist/index.html"));
});

console.log("Environment:", import.meta.env.MODE);
console.log("VITE_SOCKET_URL:", import.meta.env.VITE_SOCKET_URL);

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);

  socket.on("join_group", (groupId) => {
    console.log(`Socket ${socket.id} joining group ${groupId}`);
    socket.join(groupId);
  });

  socket.on("leave_group", (groupId) => {
    socket.leave(groupId);
  });

  socket.on("fetch_group_details", async (groupId) => {
    try {
      const group = await GroupModel.findById(groupId).populate(
        "members",
        "firstName lastName"
      );
      if (!group) {
        socket.emit("error", "Group not found");
      } else {
        socket.emit("group_details", group);
      }
    } catch (error) {
      socket.emit("error", "Failed to fetch group details");
    }
  });

  socket.on("fetch_messages", async (groupId) => {
    try {
      const messages = await MessageModel.find({ group: groupId })
        .sort({ createdAt: 1 })
        .populate("sender", "firstName lastName username");
      socket.emit("messages", messages);
    } catch (error) {
      socket.emit("error", "Failed to fetch messages");
    }
  });

  socket.on("send_message", async ({ content, groupId, senderId }) => {
    try {
      const newMessage = new MessageModel({
        content,
        sender: senderId,
        group: groupId,
      });
      await newMessage.save();
      await newMessage.populate("sender", "firstName lastName username");
      io.to(groupId).emit("receive_message", newMessage);
    } catch (error) {
      socket.emit("error", "Failed to send message");
    }
  });

  socket.on("mark_as_read", async ({ messageId, userId, groupId }) => {
    try {
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        messageId,
        { $addToSet: { readBy: userId } },
        { new: true }
      );
      io.to(groupId).emit("message_read", { messageId, userId });
    } catch (error) {
      socket.emit("error", "Failed to mark message as read");
    }
  });

  socket.on("mark_all_as_read", async ({ userId, groupId }) => {
    try {
      await MessageModel.updateMany(
        { group: groupId, readBy: { $ne: userId } },
        { $addToSet: { readBy: userId } }
      );
      const updatedMessages = await MessageModel.find({ group: groupId });
      io.to(groupId).emit("messages", updatedMessages);
    } catch (error) {
      socket.emit("error", "Failed to mark all messages as read");
    }
  });

  socket.on("error", (errorMessage) => {
    socket.emit("error", errorMessage);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
