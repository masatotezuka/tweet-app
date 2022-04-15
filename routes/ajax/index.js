const express = require("express");

const router = express.Router();
const { UserFavorite, sequelize } = require("../../models/index");

router.get("/", async (req, res, next) => {
  console.log("GET");
  try {
    const userFavoriteCounts = await UserFavorite.findAll({
      attributes: [
        "UserTweetId",
        [sequelize.fn("COUNT", sequelize.col("UserTweetId")), "favoriteCounts"],
      ],
      where: { isFavorite: true },
      group: "UserTweetId",
    });
    const userFavorites = await UserFavorite.findAll({
      attributes: ["UserId", "UserTweetId", "isFavorite"],
      where: { UserId: req.session.userId },
    });

    res.json([userFavorites, userFavoriteCounts]);
  } catch (error) {
    res.send(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const favorite = await UserFavorite.findOne({
      where: { UserTweetId: req.body.tweetId, UserId: req.session.userId },
    });
    if (!favorite) {
      await UserFavorite.create({
        isFavorite: req.body.isFavorite,
        UserTweetId: req.body.tweetId,
        UserId: req.session.userId,
      });
    } else {
      favorite.isFavorite = req.body.isFavorite;
      await favorite.save();
    }
    const favoriteCounts = await UserFavorite.count({
      where: { UserTweetId: req.body.tweetId, isFavorite: true },
    });
    res.json(favoriteCounts);
    return;
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
