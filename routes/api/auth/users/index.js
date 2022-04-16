const express = require("express");
const router = express.Router();
const { UserFavorite, sequelize } = require("../../../../models/index");

router.get("/", async (req, res, next) => {
  try {
    const userFavoriteCounts = await UserFavorite.findAll({
      attributes: [
        "UserTweetId",
        [sequelize.fn("COUNT", sequelize.col("UserTweetId")), "favoriteCounts"],
      ],
      group: "UserTweetId",
    });

    const userFavorites = await UserFavorite.findAll({
      attributes: ["UserId", "UserTweetId"],
      where: { UserId: req.session.userId },
    });
    console.log(userFavoriteCounts, userFavorites);
    res.json([userFavorites, userFavoriteCounts]);
  } catch (error) {
    res.send(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    await UserFavorite.create({
      UserTweetId: req.body.tweetId,
      UserId: req.session.userId,
    });

    const favoriteCounts = await UserFavorite.count({
      where: { UserTweetId: req.body.tweetId },
    });

    res.json(favoriteCounts);
    return;
  } catch (error) {
    res.send(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    await UserFavorite.destroy({
      where: {
        UserTweetId: req.body.tweetId,
        UserId: req.session.userId,
      },
    });
    const favoriteCounts = await UserFavorite.count({
      where: { UserTweetId: req.body.tweetId },
    });
    res.json(favoriteCounts);
    return;
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
