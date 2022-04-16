"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "UserFavorites",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        UserTweetId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "UserTweets",
            key: "id",
          },
        },
        UserId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Users",
            key: "id",
          },
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        uniqueKeys: {
          UserFavoritesIndex: {
            fields: ["UserTweetId", "UserId"],
          },
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserFavorites");
  },
};
//複合主キー　UserTweetId UserId
//index
