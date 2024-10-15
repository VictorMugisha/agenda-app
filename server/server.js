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
import friendRoutes from "./routes/friend.route.js";


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
app.use("/api/friends", friendRoutes);

// Serve the frontend client (React app)
app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

const socketToUser = new Map();

io.on("connection", (socket) => {
  console.log(`New socket connection: ${socket.id}`);

  socket.on("register_user", ({ userId, username }) => {
    socketToUser.set(socket.id, { userId, username });
    console.log(`User ${username} (${userId}) connected with socket ${socket.id}`);
  });

  socket.on("join_group", async (groupId) => {
    const user = socketToUser.get(socket.id);
    const group = await GroupModel.findById(groupId).select('name').lean();
    console.log(`User ${user?.username || 'Unknown'} (Socket ${socket.id}) joining group ${group?.name || 'Unknown'} (${groupId})`);
    socket.join(groupId);
  });

  socket.on("leave_group", async (groupId) => {
    const user = socketToUser.get(socket.id);
    const group = await GroupModel.findById(groupId).select('name').lean();
    console.log(`User ${user?.username || 'Unknown'} (Socket ${socket.id}) leaving group ${group?.name || 'Unknown'} (${groupId})`);
    socket.leave(groupId);
  });

  socket.on("fetch_group_details", async (groupId) => {
    const user = socketToUser.get(socket.id);
    console.log(`User ${user?.username || 'Unknown'} fetching details for group ${groupId}`);
    try {
      const group = await GroupModel.findById(groupId).select('name members').lean();
      if (!group) {
        console.log(`Group ${groupId} not found`);
        socket.emit('error', 'Group not found');
      } else {
        console.log(`Emitting group details for ${group.name} (${groupId}) to ${user?.username || 'Unknown'}`);
        socket.emit('group_details', group);
      }
    } catch (error) {
      console.error(`Error fetching group details for ${groupId}:`, error);
      socket.emit('error', 'Failed to fetch group details');
    }
  });

  socket.on("fetch_messages", async ({ groupId, page, limit }) => {
    const user = socketToUser.get(socket.id);
    const group = await GroupModel.findById(groupId).select('name').lean();
    console.log(`User ${user?.username || 'Unknown'} fetching messages for group ${group?.name || 'Unknown'} (${groupId}), page ${page}`);
    try {
      const skip = (page - 1) * limit;
      const messages = await MessageModel.find({ group: groupId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('sender', 'firstName lastName username')
        .lean();

      const totalMessages = await MessageModel.countDocuments({ group: groupId });
      const hasMore = totalMessages > skip + messages.length;

      console.log(`Emitting ${messages.length} messages to ${user?.username || 'Unknown'} for group ${group?.name || 'Unknown'}`);
      socket.emit('messages', { messages: messages.reverse(), hasMore });
    } catch (error) {
      console.error(`Error fetching messages for group ${group?.name || 'Unknown'} (${groupId}):`, error);
      socket.emit('error', 'Failed to fetch messages');
    }
  });

  socket.on("send_message", async ({ content, groupId, senderId }) => {
    const user = socketToUser.get(socket.id);
    const group = await GroupModel.findById(groupId).select('name').lean();
    console.log(`User ${user?.username || 'Unknown'} sending message to group ${group?.name || 'Unknown'} (${groupId})`);
    try {
      const newMessage = new MessageModel({
        content,
        sender: senderId,
        group: groupId,
      });
      await newMessage.save();
      const populatedMessage = await newMessage.populate('sender', 'firstName lastName username');
      console.log(`New message sent by ${user?.username || 'Unknown'} to group ${group?.name || 'Unknown'} (${groupId})`);
      io.to(groupId).emit('receive_message', populatedMessage);
    } catch (error) {
      console.error(`Error sending message to group ${group?.name || 'Unknown'} (${groupId}):`, error);
      socket.emit('error', 'Failed to send message');
    }
  });

  socket.on("mark_as_read", async ({ messageId, userId, groupId }) => {
    const user = socketToUser.get(socket.id);
    try {
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        messageId,
        { $addToSet: { readBy: userId } },
        { new: true }
      );
      console.log(`Message ${messageId} marked as read by ${user?.username || 'Unknown'} in group ${groupId}`);
      io.to(groupId).emit("message_read", { messageId, userId });
    } catch (error) {
      console.error(`Error marking message as read: ${error}`);
      socket.emit("error", "Failed to mark message as read");
    }
  });

  socket.on("mark_all_as_read", async ({ userId, groupId }) => {
    const user = socketToUser.get(socket.id);
    try {
      await MessageModel.updateMany(
        { group: groupId, readBy: { $ne: userId } },
        { $addToSet: { readBy: userId } }
      );
      const updatedMessages = await MessageModel.find({ group: groupId });
      console.log(`All messages marked as read by ${user?.username || 'Unknown'} in group ${groupId}`);
      io.to(groupId).emit("messages", updatedMessages);
    } catch (error) {
      console.error(`Error marking all messages as read: ${error}`);
      socket.emit("error", "Failed to mark all messages as read");
    }
  });

  socket.on("error", (errorMessage) => {
    const user = socketToUser.get(socket.id);
    console.error(`Error for user ${user?.username || 'Unknown'}: ${errorMessage}`);
    socket.emit("error", errorMessage);
  });

  socket.on("disconnect", () => {
    const user = socketToUser.get(socket.id);
    if (user) {
      console.log(`User ${user.username} (Socket ${socket.id}) disconnected`);
      socketToUser.delete(socket.id);
    } else {
      console.log(`Socket ${socket.id} disconnected`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
