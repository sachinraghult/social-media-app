const router = require("express").Router();
const Comment = require("../models/Comment");
const User = require("../models/User");
const Post = require("../models/Post");
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
    const ref = await Timeline.find({ from : req.user._id }).limit(1).sort({$natural:-1});
    if (!ref) return res.status(404).json("Timeline not found!");

    var d = new Date(ref[0].createdAt);
    d.setDate(d.getDate()+1);
    var s = new Date(ref[0].createdAt);
    s.setDate(s.getDate()-1);
    
    const timeline = await Timeline.find( {createdAt:{$gt: (s.toISOString()),$lt:(d.toISOString())}} ).sort({ createdAt: -1 });

    res.status(200).json(timeline);
  } catch (err) {
    res.status(500).json("Cannot get timeline");
  }
});

module.exports = router;