module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define("Session", {
    sid: { type: DataTypes.STRING },
    userId: { type: DataTypes.INTEGER },
    expires: { type: DataTypes.DATE },
    data: { type: DataTypes.TEXT },
  });

  return Session;
};
