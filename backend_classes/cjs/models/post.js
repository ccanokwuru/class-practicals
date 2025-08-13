'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Post.init({
    title: DataTypes.STRING,
    author_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    featured_image: DataTypes.STRING,
    slug: DataTypes.STRING,
    published_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};