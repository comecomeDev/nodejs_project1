const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  password:{
    type: String,
    require: true
  },
  title:{
    type: String,
    require : true
  },
  content:{
    type: String,
  },
  createdAt:{
    type:Date,
    default :Date.now()
  }
 
  
});

 const post = module.exports = mongoose.model("posts", postSchema);
