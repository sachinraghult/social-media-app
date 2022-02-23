const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    profilePic: {
      type: String,
      default: "https://isobarscience.com/wp-content/uploads/2020/09/default-profile-picture1.jpg",
    },
    coverPic: {
      type: String,
      default: "https://phpqna.com/wp-content/uploads/2019/08/default-cover.jpg",
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    bookmark: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Post",
    },
    status: {
      type: String,
      default: "Hi! I am using Lamasocial",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
