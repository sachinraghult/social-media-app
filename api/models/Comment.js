const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    replies: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
