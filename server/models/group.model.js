import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "No description added",
    },
    coverImg: {
      type: String,
      default:
        "https://res.cloudinary.com/victormugisha/image/upload/v1727431362/default_group_cover_twl0vc.webp",
    },
    password: {
      type: String,
      required: true,
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    announcements: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Announcement",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const GroupModel = mongoose.model("Group", groupSchema);
export default GroupModel;
