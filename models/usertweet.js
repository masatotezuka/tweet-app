module.exports = (sequelize, DataTypes) => {
  const UserTweet = sequelize.define("UserTweet", {
    userId: { type: DataTypes.INTEGER },
    tweet: { type: DataTypes.TEXT },
  });
  UserTweet.associate = (models) => {
    // UserTweet.belongsToMany(models.User, {
    //   foreignKey: "userId",
    //   targetKey: "id",
    // });
  };

  return UserTweet;
};
