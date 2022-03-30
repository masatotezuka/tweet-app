const express = require("express");
const router = express.Router();
const { UserTweet } = require("../../../models/index");

router.get("/", (req, res, next) => {
  res.render("auth/user");
});

router.post("/", async (req, res, next) => {
  console.log("DB処理" + req.body.tweet);
  await UserTweet.create({ userId: req.session.userId, tweet: req.body.tweet });
});
module.exports = router;
