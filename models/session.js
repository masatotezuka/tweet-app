module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define("Session", {
    sid: { type: DataTypes.STRING },
    UserId: { type: DataTypes.INTEGER },
    expires: { type: DataTypes.DATE },
    data: { type: DataTypes.TEXT },
  });

  return Session;
};
