import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true, // This allows the field to be optional while maintaining uniqueness
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/victormugisha/image/upload/v1727106112/xreaonjemzjchk0zxmn2.jpg",
    },
    groupsJoined: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Group",
      default: [],
    },
    groupsCreated: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Group",
      default: [],
    },
    friends: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
