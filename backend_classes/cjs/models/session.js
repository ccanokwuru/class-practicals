"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Session.belongsTo(models.User, {
        // foreignKey: "session_id",
        foreignKey: {
          name: "user_id",
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      });
    }
  }
  Session.init(
    {
      // Model attributes are defined here
      user_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Session",
    }
  );
  return Session;
};
