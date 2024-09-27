import mongoose from "mongoose";

const announcementShema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    viewers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementShema);
export default Announcement;
