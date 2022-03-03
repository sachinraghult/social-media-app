const router = require("express").Router();
const verify = require("../middleware/verify");
const Status = require("../models/Status");
const User = require("../models/User");
const axios = require("axios");
const { update } = require("../models/Status");

//CREATE STATUS
router.post("/", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("User not found!");

    const status = await Status.find({ userId: user._id });
    if (status.length > 0) {
      const response = await axios.put(
        "http://localhost:5000/api/status/",
        req.body,
        { headers: { authorization: req.header("authorization") } }
      );
      res.status(200).json(response.data);
    } else {
      const statusData = {
        content: [
          {
            desc: req.body.desc,
            photo: req.body.photo,
            duration: req.body.duration,
          },
        ],
        userId: req.user._id,
      };

      const newStatus = new Status(statusData);
      const savedStatus = await newStatus.save();

      await savedStatus.populate("userId", "name username _id profilePic");
      res.status(200).json(savedStatus);
    }
  } catch (err) {
    res.status(500).json("Cannot create status");
  }
});

//UPDATE STATUS
router.put("/", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("User not found!");

    const status = await Status.findOne({ userId: user._id });
    if (!status) return res.status(404).json("Status not found!");

    const updatedStatus = await Status.findByIdAndUpdate(
      status._id,
      {
        $push: {
          content: {
            desc: req.body.desc,
            photo: req.body.photo,
            duration: req.body.duration,
            createdAt: Date.now(),
          },
        },
        lastStatusAt: Date.now(),
      },
      { new: true }
    ).populate("userId", "name username _id profilePic");

    res.status(200).json(updatedStatus);
  } catch (err) {
    res.status(500).json("Cannot update status");
  }
});

//UPDATE SEEN BY
router.put("/seen/:id/:index", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("User not found!");

    const status = await Status.findById(req.params.id);
    if (!status) return res.status(404).json("Status not found!");

    if (parseInt(req.params.index) >= status.content.length)
      return res.status(200).json("Status limit exceded!");

    if (status.content[parseInt(req.params.index)].seenBy.includes(user._id))
      return res.status(200).json("Status already seen");

    if (user._id.toString() === status.userId.toString())
      return res.status(200).json("Status owned by you");

    status.content[parseInt(req.params.index)].seenBy.push(user._id);

    const updatedStatus = await Status.findByIdAndUpdate(
      status._id,
      {
        $set: status,
      },
      { new: true }
    ).populate("userId", "name username _id profilePic");

    res.status(200).json(updatedStatus);
  } catch (err) {
    res.status(500).json("Cannot Update SeenBy");
  }
});

//DELETE SINGLE STATUS
router.put("/delete/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("User not found!");

    const status = await Status.findOne({ userId: user._id });
    if (!status) return res.status(404).json("Status not found");

    if (!status.content.some((obj) => obj._id.toString() === req.params.id))
      return res.status(404).json("Access Denied!");

    const updatedStatus = await Status.findByIdAndUpdate(
      status._id,
      {
        $pull: { content: { _id: req.params.id } },
      },
      { new: true }
    ).populate("userId", "name username _id profilePic");

    if (updatedStatus.content.length === 0) {
      await updatedStatus.delete();
      return res.status(200).json(null);
    }

    res.status(200).json(updatedStatus);
  } catch (err) {
    res.status(500).json("Cannot update status");
  }
});

//DELETE USER'S ALL STATUS
router.delete("/", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("User not found!");

    const status = await Status.findOne({ userId: user._id });
    if (!status) return res.status(404).json("Status not found!");

    await status.delete();
    return res.status(200).json("All Status Deleted successfully!");
  } catch (err) {
    res.status(500).json("Cannot update status");
  }
});

//GET STATUS BY USER
router.get("/user/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("User not found!");

    const statusUser = await User.findById(req.params.id);
    if (!statusUser) return res.status(404).json("Access Denied!");

    const status = await Status.findOne({ userId: statusUser._id }).populate(
      "userId",
      "name username _id profilePic"
    );
    if (!status) return res.status(200).json(null);

    for (var i = 0; i < status.content.length; i++) {
      if (!status.content[i].seenBy.includes(user._id)) {
        status._doc.startAt = i;
        break;
      }
    }

    res.status(200).json(status);
  } catch (err) {
    res.status(500).json("Cannot get user status");
  }
});

//GET ALL STATUS
router.get("/", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("User not found!");

    const status = await Status.find({ userId: { $in: user.following } })
      .populate("userId", "name username _id profilePic")
      .sort({
        lastStatusAt: -1,
      });

    if (!status) return res.status(404).json("No status!");

    let seenStatus = [];
    let unseenStatus = [];

    status.map((s) => {
      var seen = true;

      for (var i = 0; i < s.content.length; i++) {
        if (!s.content[i].seenBy.includes(user._id)) {
          unseenStatus.push({ ...s._doc, startAt: i });
          seen = !seen;
          break;
        }
      }

      if (seen) seenStatus.push(s._doc);
    });

    res.status(200).json([unseenStatus, seenStatus]);
  } catch (err) {
    res.status(500).json("Cannot get user status");
  }
});

//GET SEEN BY USERS
router.get("/seenUsers/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("User not found!");

    let status = await Status.findOne({ userId: user._id });
    if (!status) return res.status(404).json("Status not found!");

    let seenUsers;

    await Promise.all(
      status.content.map(async (story, index) => {
        if (story._id.toString() === req.params.id) {
          await status.populate(
            "content." + index + ".seenBy",
            "name username _id profilePic"
          );

          seenUsers = story.seenBy;
        }
      })
    );

    return res.status(200).json(seenUsers);
  } catch (err) {
    res.status(500).json("Cannot get users seen by");
  }
});

module.exports = router;
