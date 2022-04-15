"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserFavorite = sequelize.define("UserFavorite", {
    isFavorite: { type: DataTypes.BOOLEAN },
    UserTweetId: { type: DataTypes.INTEGER },
    UserId: { type: DataTypes.INTEGER },
  });
  UserFavorite.associate = (models) => {
    UserFavorite.belongsTo(models.UserTweet);
    UserFavorite.belongsTo(models.User);
  };
  return UserFavorite;
};
