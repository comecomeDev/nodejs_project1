const express = require("express");

//const Users = require("../models/users");
const { Users,Posts } = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
//const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

//====================
// 1. 전체 게시글 목록 조회 API
router.get("/", async(req,res)=>{
  try{
   // const postAll= await Posts.find({}).sort({_id:-1}).select({postId:1,user:1,title:1,createdAt:1})
   
   const postAll = await Posts.findAll({
    attributes: ["postId", "title", "createdAt", "updatedAt"],
    order: [['createdAt', 'DESC']],
    include:[{
      model : Users,
      attributes: ["userId", "nickname"],
    //  where: { userId: 1 }
    }]

  })

  const result = [];
  let i =0;
  for(const [k, v] of Object.entries(postAll)){
    for(const [k2, v2] of Object.entries(v)){
      if(k2 === 'dataValues'){
        const tmp = new Object();
        
        tmp.postId = v2['postId'];
        tmp.title = v2['title'];
        tmp.createdAt = v2['createdAt'];
        tmp.updatedAt = v2['updatedAt'];
        tmp.userId  =  v2['User']['userId']
        tmp.nickname  =  v2['User']['nickname']
        
        result[i] = tmp;
        i++;
      }
    }
    
  }
  
  
  res.status(200).json({"posts":result}); 
  }catch(error){
    res.status(400).json({"message":"게시판 조회에 실패하였습니다." +error})
  }
})

//2. 게시글 작성 API
router.post("/",authMiddleware, async (req, res) => {
  try {

    const { userId } = res.locals.user;
    const { title, content } = req.body;
    const { authorization } = req.cookies;

    //# 412 body 데이터가 정상적으로 전달되지 않는 경우
    if(!title || !content){
      return res.status(412).json({ errorMessage:"데이터형식이 올바르지 않습니다."});
    }
    
    // # 412 Title의 형식이 비정상적인 경우
    if(typeof title  !== "string"){
      return res.status(412).json({ errorMessage:"데이터형식이 올바르지 않습니다."});  
    }

  // # 412 Content의 형식이 비정상적인 경우
  if(typeof content  !== "string"){
    
    return res.status(412).json({ errorMessage:"게시글 내용의 형식이 일치하지 않습니다"});  
  }

  
  const post = await Posts.create({
    UserId: userId,
    title,
    content
  });
  return res.status(201).json({ message:"게시글을 작성에 성공하였습니다."});

  } catch (error) {
    return res.status(400).json({ errorMessage:"게시글 작성에 실패하였습니다."});
  }
});  
 

//3. 게시글 상세 조회 API
router.get("/:postId", async (req, res) => {
  try {
    
    const { postId } = req.params;
    //const existsPost = await Posts.find({ _id :postId });
    const existsPost = await Posts.findOne({
      attributes: ["postId", "title", "createdAt", "updatedAt"],
      where: { postId }  ,
      include:[{
        model : Users,
        attributes: ["userId", "nickname"],
      //  where: { userId: 1 }
      }],
    });
    
    //console.log(existsPost);
    if(existsPost){

      const result = [];
      let i =0;
      for(const [k, v] of Object.entries(existsPost)){
        if(k === 'dataValues'){
        
          const tmp = new Object();
          tmp.postId = v.postId
          tmp.title = v.title
          tmp.createdAt = v.createdAt
          tmp.updatedAt = v.updatedAt
          tmp.userId = v.User.userId
          tmp.nickname = v.User.nickname

          result[i] = tmp;
          i++;
        }
      }
      //console.log(result);
      res.json({ posts:result });
    }else{
      throw new error()
    }

  
  } catch (error) { 
    return res.status(400).json({ errorMessage: '게시판 조회에 실패하였습니다.' });      
  }
});

//4. 게시글 수정
router.put("/:postId",authMiddleware ,async (req, res) => {
  try {
    const { postId } = req.params;
    const {title, content } = req.body;
    const { userId } = res.locals.user;
    if (!postId) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

     //# 412 body 데이터가 정상적으로 전달되지 않는 경우
     if(!title || !content){
      return res.status(412).json({ errorMessage:"데이터형식이 올바르지 않습니다."});
    }
    
    // # 412 Title의 형식이 비정상적인 경우
    if(typeof title  !== "string"){
      return res.status(412).json({ errorMessage:"데이터형식이 올바르지 않습니다."});  
    }

    // # 412 Title의 형식이 비정상적인 경우
    if(typeof content  !== "string"){
      return res.status(412).json({ errorMessage:"게시글 내용의 형식이 올바르지 않습니다."});  
    }


    const existsPost = await Posts.findOne({
      attributes: ["postId", "title", "createdAt", "updatedAt"],
      where: { postId }  
    })

    
    if (existsPost) {
      
      await Posts.update({title, content }, 
         { where : {postId}
         }).then( r =>{
           res.status(200).json({message:"게시글을 수정하였습니다."});
         }).catch(error => res.status(401).json({errorMessage:"게시글을 수정되지 못했습니다." }))

      
    }else{
      return res.status(404).json({errorMessage:"게시글 조회에 실패하였습니다"});
    }

  } catch (error) {
    // console.log(error)
    return res.status(404).json({ errorMessage: "게시글 조회에 실패하였습니다"+error });    
  } 

});



//5. 게시글 삭제
router.delete("/:postId", authMiddleware,async(req,res) =>{

  try {
    const { postId } = req.params;
    
    if(!postId ){
      throw new error()
    }
    const existsPost = await Posts.findOne({where:{postId}})
    if (existsPost) {

      await Posts.destroy({
        where: {
            [Op.and]: [{ postId }, { UserId: userId }],
          }  
        }).then(()=>{
      return res.status(200).json({message:"게시글을 삭제하였습니다."});
    
    }).catch(()=>{    
        return res.status(401).json({message:"게시글이 정상적으로 삭제되지 않습니다."});
      })
    }else{
      return res.status(404).json({message:"게시글이 조회되지 않습니다."});
    }

  } catch (error) {
    //return res.status(400).json({ message: "게시글 작성에 실패하였습니다."+error });
    return res.status(400).json({ message: "게시글 작성에 실패하였습니다."});
  }  
  
})





//====================
module.exports = router;