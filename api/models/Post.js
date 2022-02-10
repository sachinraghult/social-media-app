const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    desc: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
