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
    res.render("auth/user", { userTweets: userTweets });
  } catch (error) {
    res.send(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    await UserTweet.create({
      UserId: req.session.userId,
      tweet: req.body.tweet,
    });
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
    res.render("auth/user", { userTweets: userTweets });
  } catch (error) {
    res.send(error);
  }
});
module.exports = router;
