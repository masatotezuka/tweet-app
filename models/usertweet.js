module.exports = (sequelize, DataTypes) => {
  const UserTweet = sequelize.define("UserTweet", {
    UserId: { type: DataTypes.INTEGER },
    tweet: { type: DataTypes.TEXT },
  });
  UserTweet.associate = (models) => {
    UserTweet.belongsTo(models.User);
  };
  return UserTweet;
};
