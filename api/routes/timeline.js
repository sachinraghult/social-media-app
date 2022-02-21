const router = require("express").Router();
const verify = require("../middleware/verify");
const Timeline = require("../models/Timeline");

//INSERT TIMELINE
router.post("/", verify, async (req, res) => {
  try {
    const timelineData = { ...req.body, from: req.user._id };
    const newTimeline = new Timeline(timelineData);

    const timeline = await newTimeline.save();

    res.status(200).json(timeline);
  } catch (err) {
    res.status(500).json("Cannot insert timeline");
  }
});

//GET TIMELINE
router.get("/", verify, async (req, res) => {
  try {
    const ref = await Timeline.find({ to: req.user._id })
      .limit(1)
      .sort({ createdAt: -1 });
    if (!ref) return res.status(404).json("Timeline not found!");

    var d = new Date(ref[0].createdAt);
    var s = new Date(ref[0].createdAt);
    s.setDate(s.getDate() - 1);

    var timeline = await Timeline.find({
      to: req.user._id,
      createdAt: { $gte: s.toISOString(), $lte: d.toISOString() },
    }).sort({ createdAt: -1 });

    await Timeline.deleteMany({
      to: req.user._id,
      createdAt: { $lt: s.toISOString() },
    }).sort({ createdAt: -1 });

    await Promise.all(
      timeline.map(async (tl) => {
        tl = await tl.populate("from", "name username _id profilePic");
        tl = await tl.populate("post", "desc photo _id");
        tl = await tl.populate("comment", "comment _id post");
        tl.comment = await tl.comment.populate("post", "desc photo _id");
      })
    );

    res.status(200).json(timeline);
  } catch (err) {
    res.status(500).json("Cannot get timeline");
  }
});

module.exports = router;
