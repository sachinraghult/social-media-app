const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const verify = require("../middleware/verify");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

//UPDATE
router.put("/update", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("Access Denied!");

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: req.body,
      },
      { new: true }
    );
    const { password, ...others } = updatedUser._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json("Cannot update user");
  }
});

//ADD FOLLOWER
router.put("/follow", verify, async (req, res) => {
  try {
    const from = await User.findById(req.user._id);
    if (!from) return res.status(404).json("Access Denied!");

    let to = await User.findById(req.query.followers);
    if (!to) return res.status(404).json("User not found!");

    if (to.followers.includes(from._id))
      return res.status(404).json("Follower already exist!");

    const updatedFrom = await User.findByIdAndUpdate(
      from._id,
      {
        $push: { following: to._id },
      },
      { new: true }
    );
    const updatedTo = await User.findByIdAndUpdate(
      to._id,
      {
        $push: { followers: from._id },
      },
      { new: true }
    );

    const { password, ...others } = updatedFrom._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json("Cannot add follower");
  }
});

//UNFOLLOW
router.put("/unfollow", verify, async (req, res) => {
  try {
    const from = await User.findById(req.user._id);
    if (!from) return res.status(404).json("Access Denied!");

    let to = await User.findById(req.query.followers);
    if (!to) return res.status(404).json("User not found!");

    if (!to.followers.includes(from._id))
      return res.status(404).json("Follower not found!");

    const updatedFrom = await User.findByIdAndUpdate(
      from._id,
      {
        $pull: { following: to._id },
      },
      { new: true }
    );
    const updatedTo = await User.findByIdAndUpdate(
      to._id,
      {
        $pull: { followers: from._id },
      },
      { new: true }
    );

    const { password, ...others } = updatedFrom._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json("Cannot unfollow");
  }
});

//BLOCK
router.put("/block", verify, async (req, res) => {
  try {
    const from = await User.findById(req.user._id);
    if (!from) return res.status(404).json("Access Denied!");

    let to = await User.findById(req.query.followers);
    if (!to) return res.status(404).json("User not found!");

    if (!to.following.includes(from._id))
      return res.status(404).json("Follower not found!");

    const updatedFrom = await User.findByIdAndUpdate(
      from._id,
      {
        $pull: { followers: to._id },
      },
      { new: true }
    );
    const updatedTo = await User.findByIdAndUpdate(
      to._id,
      {
        $pull: { following: from._id },
      },
      { new: true }
    );

    const { password, ...others } = updatedFrom._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json("Cannot block follower");
  }
});

// DELETE
router.delete("/", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("Access Denied!");

    // Cannot delete the comments of the owner and the other users
    
    const posts = await Post.find({ userId: user._id });
    
    await Promise.all(
      posts.map(async (post) => {
        await Comment.deleteMany({post: post._id});
      })
    )
    await Post.deleteMany({ userId: user._id })

    await User.updateMany(
      {followers: user._id},
      {
        $pull: {followers: user._id}
      }
    );

    await User.updateMany(
      {following: user._id},
      {
        $pull: {following: user._id}
      }
    );

    await Post.updateMany(
      {likes: user._id},
      {
        $pull: {likes: user._id}
      }
    );

    await Comment.updateMany(
      {likes: user._id},
      {
        $pull: {likes: user._id}
      }
    );


    await user.delete();
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json("Cannot delete user");
  }
});

//GET USER
router.get("/", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("User not found!");

    await user.populate("followers", "name username _id profilePic");
    await user.populate("following", "name username _id profilePic");

    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json("Cannot get user");
  }
});

module.exports = router;
