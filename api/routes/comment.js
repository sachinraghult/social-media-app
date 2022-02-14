const router = require("express").Router();
const Comment = require("../models/Comment");
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const verify = require("../middleware/verify");
const mongoose = require("mongoose");

//ADD COMMENT
router.post("/", verify, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json("Access Denied!"); 

        try {
            const post = await Post.findById(req.body.post); 

            var newComment;
            if (req.body.parentId.toString() !== "") {
                newComment = new Comment({
                    comment: req.body.comment,
                    user: req.user._id,
                    post: req.body.post,
                    parent: req.body.parentId,
                });
            }
            else {
                newComment = new Comment({
                    comment: req.body.comment,
                    user: req.user._id,
                    post: req.body.post,
                });
            }
            
            const comment = await newComment.save();
    
            res.status(200).json(comment);
        } catch (err) {
            res.status(404).json("Post not found!");
        }
        
    } catch (err) {
        res.status(500).json(err);
    }
})

//UPDATE
router.put("/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("Access Denied!");

    const comment = await Comment.findById(req.params.id);
    if (!comment) 
      return res.status(404).json("Comment not found!");

    if (comment.user.toString() !== req.user._id)
      return res.status(401).json("Access Denied!");

    const updatedComment = await Comment.findByIdAndUpdate(
        req.params.id,
        {
            comment: req.body.comment,
        },
        { new: true }
    );
  
      res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

//ADD OR REMOVE LIKES
router.put("/like/:id", verify, async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json("Access Denied!");
  
      const comment = await Comment.findById(req.params.id);
      if (!comment) 
        return res.status(404).json("Comment not found!");
      
      var updatedComment;
      if (comment.likes.includes(user._id)) {
        updatedComment = await Comment.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likes: user._id },
            },
            { new: true }
        );
      }
      else {
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
      res.status(500).json(err);
    }
});

// DELETE
router.delete("/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("Access Denied!");

    const comment = await Comment.findById(req.params.id);
    if (!comment) 
      return res.status(404).json("Comment not found!");

    if (comment.user.toString() !== req.user._id)
      return res.status(401).json("Access Denied!");

    await Comment.deleteMany({ parent : comment._id});
    await comment.delete();
    
    res.status(200).json("Comment has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET COMMENT
router.get("/", verify, async (req, res) => {
  try {
    
    
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
