const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const post = require("./post");

//comment 
const commentSchema = new mongoose.Schema({
    commentId: {
      type: Schema.Types.ObjectId
    },
    password: {
      type: Number,
      require : true
    },
    content:{
      type: String,
      require : true
    },
    createdAt: {
      type: Date,
      default:Date.now
    },postId:{
      type :Schema.Types.ObjectId, 
      ref:post
    }

  });

  module.exports = mongoose.model("comments", commentSchema);