'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, { // 2. Users 모델에게 N:1 관계 설정을 합니다.
        targetKey: 'userId', // 3. Users 모델의 userId 컬럼을
        foreignKey: 'UserId', // 4. Posts 모델의 UserId 컬럼과 연결합니다.
      });

      this.belongsTo(models.Posts, { // 2. Users 모델에게 N:1 관계 설정을 합니다.
        targetKey: 'postId', // 3. Posts 모델의 postId 컬럼을
        foreignKey: 'PostId', // 4. Posts 모델의 UserId 컬럼과 연결합니다.
      });
    }
  }
  Comments.init({
    // UserId: DataTypes.INTEGER,
    // PostId: DataTypes.INTEGER,
    // comment: DataTypes.STRING

    commentId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references :{
        model : "Users",
        key : "userId"
      },onUpdate : 'CASCADE'

    },
    PostId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references :{
        model : "Posts",
        key : "postId"
      },onUpdate : 'CASCADE'
      
    },
    comment: {
      allowNull: false,
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue : DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};