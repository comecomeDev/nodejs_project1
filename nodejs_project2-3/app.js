const express = require('express');
//const connect = require('./schemas/index.js')
const commentRouter = require("./routes/comments.js");
const postRouter = require("./routes/posts.js");
const authRouter = require("./routes/auth.js");
const cookieParser = require('cookie-parser');

const app = express();
const Port = 3000;

app.use(express.json());
app.use(cookieParser());// 
app.use("/posts",[postRouter,commentRouter])
app.use("",[authRouter])

//connect();

app.listen(Port,()=>{
    console.log(Port,"포트번호로 서버 실행");
})