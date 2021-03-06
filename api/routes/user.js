const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const verify = require("../middleware/verify");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Timeline = require("../models/Timeline");
const Interaction = require("../models/Interaction");
const axios = require("axios");

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

    await updatedUser.populate("followers", "name username _id profilePic");
    await updatedUser.populate("following", "name username _id profilePic");

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

    var updatedFrom = await User.findByIdAndUpdate(
      from._id,
      {
        $push: { following: to._id },
      },
      { new: true }
    );

    await updatedFrom.populate("followers", "name username _id profilePic");
    await updatedFrom.populate("following", "name username _id profilePic");

    var updatedTo = await User.findByIdAndUpdate(
      to._id,
      {
        $push: { followers: from._id },
      },
      { new: true }
    );

    const { password, ...others } = updatedFrom._doc;

    try {
      await Timeline.deleteMany({
        from: req.user._id,
        to: to._id,
        post: null,
        comment: null,
      });

      await axios.post(
        "http://localhost:5000/api/timeline",
        { to: req.query.followers },
        { headers: { authorization: req.header("authorization") } }
      );
    } catch (err) {
      res.status(401).json("Cannot insert timeline");
    }

    await axios.put(
      "http://localhost:5000/api/interaction/" + to._id + "/follow",
      {},
      { headers: { authorization: req.header("authorization") } }
    );

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

    await updatedFrom.populate("followers", "name username _id profilePic");
    await updatedFrom.populate("following", "name username _id profilePic");

    const updatedTo = await User.findByIdAndUpdate(
      to._id,
      {
        $pull: { followers: from._id },
      },
      { new: true }
    );

    await axios.put(
      "http://localhost:5000/api/interaction/" + to._id + "/unfollow",
      {},
      { headers: { authorization: req.header("authorization") } }
    );

    const { password, ...others } = updatedFrom._doc;

    res.status(200).json(others);
  } catch (err) {
    res.status(500).json("Cannot unfollow");
  }
});

//REMOVE
router.put("/remove", verify, async (req, res) => {
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

    await updatedFrom.populate("followers", "name username _id profilePic");
    await updatedFrom.populate("following", "name username _id profilePic");

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

//HANDLE BOOKMARK
router.put("/bookmark/:id", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("Access Denied!");

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post not found!");

    var updatedUser;
    if (user.bookmark.includes(post._id)) {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { bookmark: post._id },
        },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { bookmark: post._id },
        },
        { new: true }
      );
    }

    await updatedUser.populate("followers", "name username _id profilePic");
    await updatedUser.populate("following", "name username _id profilePic");

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json("Cannot add Bookmark");
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
        await Comment.deleteMany({ post: post._id });
      })
    );
    await Timeline.deleteMany({ from: user._id });
    await Timeline.deleteMany({ to: user._id });
    await Comment.deleteMany({ user: user._id });
    await Post.deleteMany({ userId: user._id });

    await User.updateMany(
      { followers: user._id },
      {
        $pull: { followers: user._id },
      }
    );

    await User.updateMany(
      { following: user._id },
      {
        $pull: { following: user._id },
      }
    );

    await Post.updateMany(
      { likes: user._id },
      {
        $pull: { likes: user._id },
      }
    );

    await Comment.updateMany(
      { likes: user._id },
      {
        $pull: { likes: user._id },
      }
    );

    await user.delete();
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json("Cannot delete user");
  }
});

//GET BOOKMARK
router.get("/bookmarks", verify, async (req, res) => {
  try {
    const profile = req.query.profile;

    var user;
    if (profile) user = await User.findById(profile);
    else user = await User.findById(req.user._id);

    if (!user) return res.status(404).json("User not found!");

    await user.populate("bookmark", "desc photo userId likes edited _id");
    await Promise.all(
      user.bookmark.map(async (b) => {
        b = await b.populate("userId", "name username _id profilePic");
      })
    );

    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json("Cannot get user");
  }
});

//GET USER
router.get("/", verify, async (req, res) => {
  try {
    const profile = req.query.profile;

    var user;
    if (profile) user = await User.findById(profile);
    else user = await User.findById(req.user._id);

    if (!user) return res.status(404).json("User not found!");

    await user.populate("followers", "name username _id profilePic");
    await user.populate("following", "name username _id profilePic");

    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json("Cannot get user");
  }
});

//GET SUGGESTIONS

router.get("/suggestions", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("User not found!");

    var people = [];

    await Promise.all(
      user.following.map(async (b) => {
        var userFollowers = await User.findById(b).populate(
          "following",
          "name username _id profilePic"
        );

        var addParent = userFollowers.following;
        addParent = addParent.map((u) => ({
          ...u._doc,
          parent: {
            name: userFollowers.name,
            username: userFollowers.username,
            _id: userFollowers._id,
            profilePic: userFollowers.profilePic,
          },
        }));
        people.push(...addParent);
      })
    );

    people = people.filter((item) => !user.following.includes(item._id));
    people = people.filter(
      (item) => user._id.toString() !== item._id.toString()
    );

    const response = Array.from(new Set(people.map((s) => s.username))).map(
      (lab, index) => {
        return {
          _id: people[index]._id,
          username: lab,
          name: people[index].name,
          profilePic: people[index].profilePic,
          parent: people
            .filter((s) => s.username === lab)
            .map((op) => op.parent),
        };
      }
    );

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json("Cannot get Suggestions");
  }
});

//GET DEFAULT SEARCHBOX VALUE
router.get("/defaultValue", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("User not found!");

    const interaction = await Interaction.find({
      from: req.user._id,
    })
      .sort({ weight: 1 })
      .limit(8)
      .sort({ weight: -1 });

    if (!interaction) return res.status(404).json("Interaction not found!");

    let response = [];
    await Promise.all(
      interaction.map(async (i) => {
        const resp = await User.findById(i.to);
        response.push({...resp._doc, weight: i.weight});
      })
    );

    response.sort((a, b) => {
      return b.weight - a.weight;
    })

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json("Cannot get default value");
  }
});

//GET SEARCHBOX
router.get("/searchbox", verify, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json("User not found!");

    var text = req.query.search;

    const response = await User.find()
      .or([
        { username: { $regex: text, $options: "i" } },
        { name: { $regex: text, $options: "i" } },
      ])
      .limit(30);

    let interactors = [];
    await Promise.all(
      response.map(async (r) => {
        const interactor = await Interaction.find({
          from: req.user._id,
          to: r._id,
        });
        if (interactor.length > 0) interactors.push(r);
      })
    );

    let remaining = [];
    remaining = response.filter(function (item) {
      return interactors.indexOf(item) < 0;
    });

    res.status(200).json([interactors, remaining]);
  } catch (err) {
    res.status(500).json("Cannot search");
  }
});

module.exports = router;
