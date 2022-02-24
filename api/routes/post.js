const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const verify = require("../middleware/verify");
const Comment = require("../models/Comment");
const Timeline = require("../models/Timeline");
const axios = require("axios");
const { update } = require("../models/User");

//CREATE
router.post("/", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("User not found!");

    const postData = { ...req.body, userId: req.user._id };
    const newPost = new Post(postData);

    var savedPost = await newPost.save();
    savedPost = await savedPost.populate(
      "userId",
      "name username _id profilePic"
    );

    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json("Cannot create post");
  }
});

//UPDATE
router.put("/:id", verify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json("Post not found!");
    if (post.userId.toString() !== req.user._id)
      return res.status(401).json("Access Denied!");

    var updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
        edited: Date.now(),
      },
      { new: true }
    ).populate("userId", "name username _id profilePic");

    updatedPost = await updatedPost.populate(
      "likes",
      "name username _id profilePic"
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json("Cannot update post");
  }
});

//ADD OR REMOVE LIKES
router.put("/like/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("Access Denied!");

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found!");

    var updatedPost;
    if (post.likes.includes(user._id)) {
      updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likes: user._id },
        },
        { new: true }
      );

      await axios.put(
        "http://localhost:5000/api/interaction/" + post.userId + "/dislike",
        {},
        { headers: { authorization: req.header("authorization") } }
      );
    } else {
      updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $push: { likes: user._id },
        },
        { new: true }
      );

      await axios.put(
        "http://localhost:5000/api/interaction/" + post.userId + "/like",
        {},
        { headers: { authorization: req.header("authorization") } }
      );

      const result = await Timeline.find({
        from: req.user._id,
        to: post.userId,
        post: post._id,
        comment: null,
      });

      if (result.length === 0) {
        try {
          await axios.post(
            "http://localhost:5000/api/timeline",
            { to: post.userId, post: post._id },
            { headers: { authorization: req.header("authorization") } }
          );
        } catch (err) {
          res.status(401).json("Cannot insert timeline");
        }
      }
    }

    updatedPost = await updatedPost.populate(
      "likes",
      "name username _id profilePic"
    );
    updatedPost = await updatedPost.populate(
      "userId",
      "name username _id profilePic"
    );

    var comments = await Comment.find({ post: updatedPost._id, parent: null });
    const response = { ...updatedPost._doc, size: comments.length };

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json("Cannot update");
  }
});

//DELETE
router.delete("/:id", verify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found!");

    if (post.userId.toString() !== req.user._id)
      return res.status(401).json("Access Denied!");

    await Timeline.deleteMany({ post: post._id });
    await Comment.deleteMany({ post: post._id });
    await post.delete();
    res.status(200).json("Post has been deleted!");
  } catch (err) {
    res.status(500).json("Cannot delete post");
  }
});

//GET POST
router.get("/:id", verify, async (req, res) => {
  try {
    var post = await Post.findById(req.params.id).populate(
      "userId",
      "name username _id profilePic"
    );

    post = await post.populate("likes", "name username _id profilePic");

    var comments = await Comment.find({ post: post._id, parent: null });
    const response = { ...post._doc, size: comments.length };

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json("Cannot get a post");
  }
});

//GET ALL POSTS / USER POSTS / FEED POSTS
router.get("/", verify, async (req, res) => {
  const userName = req.query.user;
  const feed = req.query.feed;

  try {
    let posts;
    if (feed === "true") {
      const user = await User.findById(req.user._id);
      posts = await Post.find({
        userId: { $in: user.following },
      })
        .sort({ createdAt: -1 })
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

    var response = [];
    await Promise.all(
      posts.map(async (post) => {
        await post.populate("likes", "name username _id profilePic");
        var comments = await Comment.find({ post: post._id, parent: null });
        response.push({ ...post._doc, size: comments.length });
      })
    );

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json("Cannot get posts");
  }
});

module.exports = router;
