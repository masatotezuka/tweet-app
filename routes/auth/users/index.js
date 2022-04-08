const express = require("express");
const router = express.Router();
const { UserTweet, User } = require("../../../models/index");
const format = require("date-fns/format");
router.get("/", async (req, res, next) => {
  try {
    const userTweets = await UserTweet.findAll({
      attributes: ["id", "tweet", "createdAt"],
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "firstName"],
        },
      ],
    });
    userTweets.forEach((element) => {
      console.log(element.User.firstName);
    });
    res.render("auth/user", { userTweets: userTweets });
  } catch (error) {
    res.send(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    await UserTweet.create({
      userId: req.session.userId,
      tweet: req.body.tweet,
    });
    const userTweets = await UserTweet.findAll({
      attributes: ["id", "tweet", "createdAt"],
      include: [
        {
          model: UserTweet,
          attributes: ["userId", "tweet", "createdAt"],
        },
      ],
      order: [[UserTweet, "createdAt", "DESC"]],
    });
    res.render("auth/user", { userTweets: userTweets });
  } catch (error) {
    res.send(error);
  }
});
module.exports = router;
