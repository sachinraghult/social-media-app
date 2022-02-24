const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./routes/auth");
const post = require("./routes/post");
const user = require("./routes/user");
const comment = require("./routes/comment");
const timeline = require("./routes/timeline");
const multer = require("multer");
const path = require("path");
const interaction = require("./routes/interaction");

const app = express();

//middleware
dotenv.config();
app.use(express.json());

const corsOptions = {
  exposedHeaders: "authorization",
};
app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Connected to DB"))
  .catch((err) => console.log(err));

app.use("/video", express.static(path.join(__dirname, "/video")));
app.use("/image", express.static(path.join(__dirname, "/image")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${req.params.type}`);
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload/:type", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", auth);
app.use("/api/post", post);
app.use("/api/user", user);
app.use("/api/comment", comment);
app.use("/api/timeline", timeline);
app.use("/api/interaction", interaction);

app.get("/", (req, res) => res.send("hello world"));

app.listen(5000, () => console.log("API running"));
