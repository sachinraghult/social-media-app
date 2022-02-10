const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authToken = req.header("authorization");
  if (!authToken) return res.status(401).json("Access Denied!");

  try {
    const verified = jwt.verify(authToken, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
