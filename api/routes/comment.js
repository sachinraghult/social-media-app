const router = require("express").Router();
const Comment = require("../models/Comment");
const User = require("../models/User");
const Post = require("../models/Post");
const verify = require("../middleware/verify");
const axios = require("axios");

//ADD COMMENT
router.post("/", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("Access Denied!");

    try {
      const post = await Post.findById(req.body.post);

      var newComment;
      if (req.body.parentId.toString() !== "") {
        const parentComment = await Comment.findById(req.body.parentId);

        if (typeof parentComment.parent === "undefined") {
          newComment = new Comment({
            comment: req.body.comment,
            user: req.user._id,
            post: req.body.post,
            parent: req.body.parentId,
          });
        } else {
          return res.status(401).json("Connot comment to a reply");
        }
      } else {
        newComment = new Comment({
          comment: req.body.comment,
          user: req.user._id,
          post: req.body.post,
        });
      }

      var comment = await newComment.save();
      comment = await comment.populate("user", "name username _id profilePic");

      try {
        await axios.post(
          "http://localhost:5000/api/timeline",
          { to: comment.user, post: comment.post, comment: comment._id },
          { headers: { authorization: req.header("authorization") } }
        );
      } catch (err) {
        res.status(401).json("Cannot insert timeline");
      }

      res.status(200).json(comment);
    } catch (err) {
      res.status(404).json("Post not found!");
    }
  } catch (err) {
    res.status(500).json("Cannot create comment");
  }
});

//UPDATE
router.put("/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("Access Denied!");

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json("Comment not found!");

    if (comment.user.toString() !== req.user._id)
      return res.status(401).json("Access Denied!");

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        comment: req.body.comment,
        edited: true,
      },
      { new: true }
    ).populate("user", "name username _id profilePic");

    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json("Cannot update comment");
  }
});

//ADD OR REMOVE LIKES
router.put("/like/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("Access Denied!");

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json("Comment not found!");

    var updatedComment;
    if (comment.likes.includes(user._id)) {
      updatedComment = await Comment.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likes: user._id },
        },
        { new: true }
      );
    } else {
      updatedComment = await Comment.findByIdAndUpdate(
        req.params.id,
        {
          $push: { likes: user._id },
        },
        { new: true }
      );
    }

    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json("Cannot update");
  }
});

// DELETE
router.delete("/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("Access Denied!");

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json("Comment not found!");

    if (comment.user.toString() !== req.user._id)
      return res.status(401).json("Access Denied!");

    await Comment.deleteMany({ parent: comment._id }).catch((err) =>
      res.status(404).json("Cannot find any reply")
    );

    await comment.delete();

    res.status(200).json("Comment has been deleted...");
  } catch (err) {
    res.status(500).json("Cannot delete comment");
  }
});

//GET COMMENTS
router.get("/:id", verify, async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.id,
      parent: null,
    })
      .populate("user", "name username _id profilePic")
      .sort({ comment: -1 });

    var response = [];
    await Promise.all(
      comments.map(async (comment) => {
        var replies = await Comment.find({ parent: comment._id });
        response.push({ ...comment._doc, size: replies.length });
      })
    );

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json("Cannot get comment");
  }
});

//GET REPLIES
router.get("/replies/:id", verify, async (req, res) => {
  try {
    const replies = await Comment.find({ parent: req.params.id })
      .populate("user", "name username _id profilePic")
      .sort({ comment: -1 });

    res.status(200).json(replies);
  } catch (err) {
    res.status(500).json("Cannot get comment");
  }
});

module.exports = router;
