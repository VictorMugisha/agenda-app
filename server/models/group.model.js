import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    coverImg: {
      type: String,
      default: "",
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
