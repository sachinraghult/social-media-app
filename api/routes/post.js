const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const verify = require("../middleware/verify");

//CREATE
router.post("/", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("User not found!");

    const postData = { ...req.body, userId: req.user._id };
    const newPost = new Post(postData);

    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found!");
    if (post.userId.toString() !== req.user._id)
      return res.status(401).json("Access Denied!");

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found!");

    if (post.userId.toString() !== req.user._id)
      return res.status(401).json("Access Denied!");

    await post.delete();
    res.status(200).json("Post has been deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET POST
router.get("/:id", verify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "userId",
      "name username _id profilePic"
    );
    res.status(200).json(post._doc);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL POST
router.get("/", verify, async (req, res) => {
  const userName = req.query.user;
  const feed = req.query.feed;

  try {
    let posts;
    if (feed === "true") {
      const user = await User.findById(req.user._id);
      posts = await Post.find({
        userId: { $in: user.followers },
      })
        .sort({ timestamps: -1 })
        .populate("userId", "name username _id profilePic");
    } else if (userName) {
      const user = await User.findOne({ username: userName });
      posts = await Post.find({ userId: user._id }).populate(
        "userId",
        "name username _id profilePic"
      );
    } else {
      posts = await Post.find().populate(
        "userId",
        "name username _id profilePic"
      );
    }

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
