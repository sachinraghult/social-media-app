const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
  content: [
    {
      desc: {
        type: String,
      },
      photo: {
        type: String,
        required: true,
      },
      createdAt: {
          type: Date,
          default: Date.now(),
      },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  seenBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
});

module.exports = mongoose.model("Status", StatusSchema);
