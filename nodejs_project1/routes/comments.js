const express = require("express");
const Comments = require("../schemas/comment");
const Posts = require("../schemas/post");

const router = express.Router();

//댓글 생성
router.post("/:postId/comments", async (req, res) => {
    
    try {
        const {postId} = req.params;
        const {user, password, content} = req.body;

        if(!postId ||  postId.length ==0 ){
            throw new Error();
        }

        //content 값이 없을 경우 400 
        if(!content || content ===''){
            const messagge = '댓글 내용을 입력해주세요.'
            return
        }
        //post 검색
        const existsPost = await Posts.find({ _id :postId });
        //console.log(existsPost)
        if(!existsPost){
            throw new Error();
        }
        
        await Comments.create({  user, password, content,postId});
            
        //res.json({ posts: createPost });
        res.json({ "message":"댓글을 생성하였습니다."});
        } catch (error) {
            res.status(400).json({ "message":"데이터형식이 올바르지 않습니다."});
            return 
        }
    });
    
//댓글 목록조회
router.get("/:postId/comments", async(req,res) =>{
    try {
        const {postId} = req.params;
        if(!postId){
            throw new Error();
        }
       
        const existsComments = await Comments.find({ postId :postId },{_id:1,password:1,content:1,createdAt:1}).sort({createdAt:-1})
    
        res.status(200).json({data:existsComments});
    } catch (error) {
        res.status(400).json({ "message":"데이터형식이 올바르지 않습니다."});
        
    }

})

//댓글 수정
router.put("/:postId/comments/:commentId", async(req,res) =>{
    try {
        const {postId,commentId} = req.params;
        const {password, content} = req.body;
        

        //postId 와 comentID 값이 없을 경우  404
        if(!postId || !commentId || !password || postId.length ===0 || commentId.length ==0 || password.length == 0){
            const messagge = '데이터 형식이 올바르지 않습니다.'
            res.status(400).json({ "message":messagge});
            return
        }

        //postId 값이 없을 경우 400
        const existsPost = await Posts.find({ _id :postId });
        if(!existsPost){
            const messagge = '데이터 형식이 올바르지 않습니다.'
            res.status(400).json({ "message":messagge});
            return
        }
        
         //content 값이 없을 경우 400 
        if(!content || content ===''){
            const messagge = '댓글 내용을 입력해주세요.'
            res.status(400).json({ "message":messagge});
            return
        }
       

        
        const existsComment =  await Comments.find({_id :commentId,password} );
        
        if(!existsComment || existsComment.length ==0){
            throw new Error();
        }else{
            await Comments.updateOne({ _id: commentId },  { content } );
            res.status(200).json({ "message":"댓글을 수정하였습니다."});

           
        }


        
    } catch (error) {
        res.status(404).json({ "message":"댓글 조회에 실패하였습니다"});
    }

})

//댓글삭제
router.delete("/:postId/comments/:commentId", async(req,res) =>{
    try {
        const {postId,commentId} = req.params;
        const {password} = req.body;


        //postId 와 comentID 값이 없을 경우  404
        if(!postId || !commentId || !password || postId.length ===0 || commentId.length ==0 || password.length ==0){
            const messagge = '데이터 형식이 올바르지 않습니다.'
            res.status(400).json({ "message":messagge});
        }
        //패스워드가 존재하지 않는경우 
        //해당하는 댓글이 없을 경우 
        const existsComment = await Comments.find({ _id:commentId,password:password});
        
        if(!existsComment || existsComment.length==0){
            throw new Error();
        }else{
            await Comments.findByIdAndDelete({ _id: commentId ,password:password} );
            res.status(200).json({ "message":"댓글을 삭제하였습니다."});
        }

    } catch (error) {
        res.status(400).json({ "message":"데이터삭제가 실패하였습니다."});
    }
})


//====================
module.exports = router;
  