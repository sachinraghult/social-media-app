const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: hashPwd,
      dob: new Date(req.body.dob),
      gender: req.body.gender,
    });

    const user = await newUser.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json("Cannot register");
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).json("Wrong Credentials!");

    const validated = await bcrypt.compare(req.body.password, user.password);
    if (!validated) return res.status(400).json("Wrong credentials!");

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRY,
    });

    const { password, ...others } = user._doc;
    res.setHeader("authorization", token);
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json("Cannot login");
  }
});

module.exports = router;
