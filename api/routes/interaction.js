const router = require("express").Router();
const axios = require("axios");
const verify = require("../middleware/verify");
const Interaction = require("../models/Interaction");
const User = require("../models/User");

const handleCount = (type) => {
  if (type === "like") return 1;
  else if (type === "comment") return 2;
  else if (type === "follow") return 5;
  else if (type === "unfollow") return -5;
  else if (type === "dislike") return -1;
  else return 0;
};

//CREATE INTERACTION
router.post("/:id/:type", verify, async (req, res) => {
  try {
    const newInteraction = new Interaction({
      from: req.user._id,
      to: req.params.id,
      weight: handleCount(req.params.type),
    });

    const savedInteraction = await newInteraction.save();

    res.status(200).json(savedInteraction);
  } catch (err) {
    res.status(500).json("Cannot create interaction");
  }
});

//EDIT INTERACTION
router.put("/:id/:type", verify, async (req, res) => {
  try {
    const from = await User.findById(req.user._id);
    if (!from) return res.status(404).json("Access Denied!");

    const to = await User.findById(req.params.id);
    if (!to) return res.status(404).json("User not found!");

    const interaction = await Interaction.find({ from: from._id, to: to._id });
    if (interaction.length === 0) {
      const response = await axios.post(
        "http://localhost:5000/api/interaction/" +
          to._id +
          "/" +
          req.params.type,
        {},
        { headers: { authorization: req.header("authorization") } }
      );

      res.status(200).json(response.data);
    } else {
      const updatedInteraction = await Interaction.findByIdAndUpdate(
        interaction[0]._id,
        {
          weight: interaction[0].weight + handleCount(req.params.type),
        },
        { new: true }
      );

      res.status(200).json(updatedInteraction);
    }
  } catch (err) {
    res.status(500).json("Cannot update interaction");
  }
});

//GET INTERACTION
router.get("/", verify, async (req, res) => {
  try {
    const interaction = await Interaction.find({ from: req.user._id })
      .sort({ weight: 1 })
      .limit(8)
      .sort({ weight: -1 });
    if (!interaction) return res.status(404).json("Interaction not found!");

    await Promise.all(
      interaction.map(async (i) => {
        i = await i.populate("to", "name username _id profilePic");
      })
    );
    res.status(200).json(interaction);
  } catch (err) {
    console.log(err);
    res.status(500).json("Cannot get interaction");
  }
});

module.exports = router;
