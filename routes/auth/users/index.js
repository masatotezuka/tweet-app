const express = require("express");
const router = express.Router();
const { UserTweet, User } = require("../../../models/index");
const format = require("date-fns/format");
router.get("/", async (req, res, next) => {
  try {
    // const userTweets = await UserTweet.findAll({
    //   attributes: ["id", "tweet", "createdAt"],
    //   order: [["createdAt", "DESC"]],
    //   include: [
    //     {
    //       model: User,
    //       attributes: ["id", "firstName"],
    //     },
    //   ],
    //   order: [[UserTweet, "createdAt", "DESC"]],
    // });
    const userTweets = await User.findAll({
      attributes: ["id", "firstName"],
      // order: [["createdAt", "DESC"]],
      include: [
        {
          model: UserTweet,
          attributes: ["userId", "tweet", "createdAt"],
        },
      ],
      order: [[UserTweet, "createdAt", "DESC"]],
    });

    userTweets.forEach((element) => {
      console.log(element);
    });
    // userTweets.map((element) => {
    //   console.log(element.createdAt);
    //   format(element.createdAt, "yyyy/MM/dd");
    //   console.log(element.createdAt);
    //   return element;
    // });
    // console.log(JSON.stringify(userTweets, null, 2));
    // console.log("変換後" + userTweets[0].createdAt);
    res.render("auth/user", { userTweets: userTweets });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res, next) => {
  await UserTweet.create({ userId: req.session.userId, tweet: req.body.tweet });
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
});
module.exports = router;
