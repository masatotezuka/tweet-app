module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    email: {
      type: DataTypes.STRING,
      validate: { isEmail: true },
      unique: true,
    },
    password: { type: DataTypes.STRING },
    verificationToken: { type: DataTypes.STRING, defaultValue: null },
    verificationTokenExpiredAt: { type: DataTypes.DATE },
  });
  User.associate = (models) => {
    User.hasMany(models.UserTweet);
  };
  return User;
};
