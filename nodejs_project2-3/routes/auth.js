const express = require("express");
const { Users } = require("../models");
const jwt = require("jsonwebtoken");

const router = express.Router();

//회원가입
router.post("/signup", async (req, res) => {
    try {
        
        const { nickname, password, confirm } = req.body;
        console.log("test :" +nickname)
        const isExistUser = await Users.findOne({ where: { nickname} });
        console.log("test" +isExistUser)
    
        if (isExistUser) {
        return res.status(412).json({ message: "중복된 이메일입니다." });
        }
        //닉네임 형식 불일치 
        //최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)
        const regNickName = /[A-z0-9]{3,10}/g;
        if(!nickname.match(regNickName)){
            return res.status(412).json({ message: "닉네임의 형식이 일치하지 않습니다." });
        }

        // 비밀번호 비정상적
        //최소 4자 이상이며
        const regPassword1 = /.{4}/g;
        if(!password.match(regPassword1)){
            return res.status(412).json({ message: "패스워드 형식이 일치하지 않습니다." });
        }
        //비밀번호 불일치
        if(!password.match(confirm)){
            return res.status(412).json({ message: "패스워드가 일치하지 않습니다." });
        }

        //비밀번호에 닉네임이 포함된경우
        if(password.includes(nickname)){
            return res.status(412).json({ message: "패스워드에 닉네임이 포함되어 있습니다." });
        }
        
        // Users 테이블에 사용자를 추가합니다.
        const user = await Users.create({ nickname, password });
          
        return res.status(201).json({ message: "회원가입이 성공하였습니다." });
    } catch (error) {
        return res.status(400).json({ errorMessage: "요청한 데이터형식이 올바르지 않습니다." });
    }
  });
  
  //로그인
  router.post("/login",async (req,res)=>{
    try{
        const {nickname,password} = req.body

        const user = await Users.findOne({ where: { nickname } });
        if (!user) {
        return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
        } else if (user.password !== password) {
        return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
        }
    
        const token = jwt.sign({
        userId: user.userId
        }, "customized_secret_key");
        res.cookie("authorization", `Bearer ${token}`);
        return res.status(200).json({ token: token });

    }catch(error){
        return res.status(400).json({ errorMessage: "요청한 데이터형식이 올바르지 않습니다." });
    }

  });


  module.exports = router;
