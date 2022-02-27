const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
  content: [
    {
      desc: {
        type: String,
      },
      photo: {
        type: String,
      },
      duration: {
        type: Number,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      seenBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
      },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  lastStatusAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Status", StatusSchema);
