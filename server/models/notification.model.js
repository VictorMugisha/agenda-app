import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      reqired: true,
    },
    content: {
      type: String,
      reqired: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    recipients: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
