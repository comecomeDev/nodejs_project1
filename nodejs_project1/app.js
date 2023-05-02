const express = require('express');
const app = express();
const port = 3000;


const connect = require('./schemas/index.js')
const commentRouter = require("./routes/comments.js");
const postRouter = require("./routes/posts.js");

app.use(express.json());
app.use("/posts",[postRouter,commentRouter])



connect();

app.listen(port, ()=>{
    console.log(port,"포트 열렸습니다.");
})