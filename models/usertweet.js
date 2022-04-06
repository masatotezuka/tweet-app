module.exports = (sequelize, DataTypes) => {
  const UserTweet = sequelize.define("UserTweet", {
    userId: { type: DataTypes.INTEGER },
    tweet: { type: DataTypes.TEXT },
  });
  UserTweet.associate = (models) => {
    UserTweet.belongsTo(models.User);
  };

  return UserTweet;
};

// , {
//   foreignKey: "userId",
//   targetKey: "id",
// }
