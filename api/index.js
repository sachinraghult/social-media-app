const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./routes/auth");
const post = require("./routes/post");

const app = express();

//middleware
dotenv.config();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Connected to DB"))
  .catch((err) => console.log(err));

app.use("/api/auth", auth);
app.use("/api/post", post);

app.get("/", (req, res) => res.send("hello world"));

app.listen(5000, () => console.log("API running"));
