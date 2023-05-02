const express = require("express");
const Posts = require("../schemas/post");
const Comments = require("../schemas/comment");

const router = express.Router();

//====================
// 1. 전체 게시글 목록 조회 API
router.get("/", async(req,res)=>{
   const postAll= await Posts.find({ postId :postId },{_id:1}).sort({_id:-1})

   res.status(200).json({"data":postAll}); //{goods}
})

//2. 게시글 작성 API
router.post("/", async (req, res) => {
  try {
    const {  user, password, title, content } = req.body;
    const createPost= await Posts.create({  user, password, title, content});

  //res.json({ posts: createPost });
    res.json({ "message":"게시글을 작성하였습니다."});
  } catch (error) {
    res.status(400).json({ "message":"데이터형식이 올바르지 않습니다."});
  }
});  
 
//3. 게시글 조회 API
router.get("/:postId", async (req, res) => {
  try {
    
    const { postId } = req.params;
    const existsPost = await Posts.find({ _id :postId });
    
    if(existsPost){
      res.json({ data:existsPost });
    }else{
      res.json({ message: '데이터 형식이 올바르지 않습니다.' });
    }

  } catch (error) {
    
    res.json({ message: '데이터 형식이 올바르지 않습니다.' });      
  }
});

//4. 게시글 수정
router.put("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const {user, password, title, content } = req.body;
    
    const existsPost = await Posts.find({ _id: postId });
    
    if (!postId) {
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }

    if (existsPost.length) {
      await Posts.updateOne({ _id: postId },  { user, password, title, content  } );
      res.json({message:"게시글을 수정하였습니다."});
    }else{
      res.status(404).json({message:"게시글 조회에 실패하였습니다"});
    }

  } catch (error) {
    console.log(error)
    res.status(404).json({ message: "게시글 조회에 실패하였습니다" });    
  } 

});



//5. 게시글 삭제
router.delete("/:postId", async(req,res) =>{

  try {
    const { postId } = req.params;
    const {password} = req.body;  
    
    if(!postId || !password){
    
      res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
      return;
    }
    const existsPost = await Posts.find({ _id: postId ,password:password } );
   // console.log(existsPost)
    if (existsPost.length) {
      await Posts.deleteOne({ _id: postId } );
      res.json({message:"게시글을 삭제하였습니다."});
    }else{
      res.status(404).json({message:"게시글 조회에 실패하였습니다"});
      return;
    }

  } catch (error) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
  }  
  
})





//====================
module.exports = router;