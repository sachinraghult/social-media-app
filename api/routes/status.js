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
          },
        ],
        userId: req.user._id,
      };

      const newStatus = new Status(statusData);
      const savedStatus = await newStatus.save();

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
        $push: { content: { desc: req.body.desc, photo: req.body.photo } },
      },
      { new: true }
    );

    res.status(200).json(updatedStatus);
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

    const status = await Status.findOne({ userId: statusUser._id });
    if (!status) return res.status(404).json("Status not found!");

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

    const status = await Status.find({ userId: { $in: user.following } });
    if (!status) return res.status(404).json("No status!");

    res.status(200).json(status);
  } catch (err) {
    res.status(500).json("Cannot get user status");
  }
});

//DELETE SINGLE STATUS
router.put("/delete/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("User not found!");

    const status = await Status.findOne({ userId: user._id });
    if (!status)
      return res.status(404).json("Status not found");

    if (!status.content.some((obj) => obj._id.toString() === req.params.id))
      return res.status(404).json("Access Denied!");
    

    const updatedStatus = await Status.findByIdAndUpdate(
      status._id,
      {
        $pull: { content: { _id: req.params.id } },
      },
      { new: true }
    );

    if (updatedStatus.content.length === 0) {
      await updatedStatus.delete();
      return res.status(200).json("Status Deleted successfully!");
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

module.exports = router;
