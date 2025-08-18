"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Session, {
        foreignKey: {
          name: "userId",
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        as: "sessions",
      });
      User.hasMany(models.Post, {
        foreignKey: {
          name: "authorId",
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        as: "posts",
      });
    }
  }
  User.init(
    {
      // Model attributes are defined here
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
        // allowNull defaults to true
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
