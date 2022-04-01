const express = require("express");
const router = express.Router();
const { UserTweet } = require("../../../models/index");
const format = require("date-fns/format");
router.get("/", async (req, res, next) => {
  const userTweets = await UserTweet.findAll({
    attributes: ["id", "tweet", "createdAt"],
    order: [["createdAt", "DESC"]],
  });
  console.log("変換前" + userTweets[0].createdAt);
  // userTweets.forEach((element) => {
  //   format(element.createdAt, "YYYY/MM/DD");
  //   console.log(element.createdAt);
  // });
  userTweets.map((element) => {
    console.log(element.createdAt);
    format(element.createdAt, "yyyy/MM/dd");
    console.log(element.createdAt);
    return element;
  });
  console.log("変換後" + userTweets[0].createdAt);
  res.render("auth/user", { userTweets: userTweets });
});

router.post("/", async (req, res, next) => {
  await UserTweet.create({ userId: req.session.userId, tweet: req.body.tweet });
  const userTweets = await UserTweet.findAll({
    attributes: ["id", "tweet", "createdAt"],
    order: [["createdAt", "DESC"]],
  });
  res.render("auth/user", { userTweets: userTweets });
});
module.exports = router;
