"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, {
        foreignKey: {
          name: "authorId",
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        as: "author",
      });
    }
  }
  Post.init(
    {
      title: DataTypes.STRING,
      authorId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      featuredImage: DataTypes.STRING,
      slug: DataTypes.STRING,
      publishedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Post",
    }
  );
  return Post;
};
