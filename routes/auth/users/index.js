const express = require("express");
const router = express.Router();
const { UserTweet, User, UserFavorite } = require("../../../models/index");

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
    res.render("auth/user", {
      userTweets: userTweets,
    });
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
    res.redirect("/auth/users");
  } catch (error) {
    res.send(error);
  }
});
module.exports = router;
