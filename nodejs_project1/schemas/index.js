const mongoose = require("mongoose");

const connect = () => {
     mongoose
    .connect("mongodb://127.0.0.1:27017/node_project1_db")
    .then(() =>{
      console.log("connecting!")
    })
    .catch(err => "에러발생 :" +console.log(err));
};

mongoose.connection.on("error", err => {
  console.error("db connect error!", err);
});

module.exports = connect;