const express = require("express");
const { Users,Posts,Comments } = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

//댓글 생성
router.post("/:postId/comments",authMiddleware, async (req, res) => {
    
    try {
        const { userId } = res.locals.user;
        const {postId} = req.params;
        const {comment} = req.body;

        //content 값이 없을 경우 412
        if(typeof comment !== "string"){
            return res.status(412).json({ "errorMessage":"데이터 형식이 올바르지 않습니다."});
        }

        //post 검색
        const existsPost = await Posts.findOne ({ where :{postId} })
        
        console.log(existsPost)
        //# 404 댓글을 작성할 게시글이 존재하지 않는경우
        if(!existsPost){
            return res.status(404).json({ "errorMessage":"게시글이 존재하지 않습니다."});
        }
        
        await Comments.create({ 
            UserId: userId,
            PostId:postId,
            comment
        })
        
        return  res.status(201).json({ "errorMessage":"댓글을 생성하였습니다."});
        } catch (error) {
            return res.status(400).json({ "errorMessage":"댓글생성에 실패하였습니다."+error});
             
        }
    });
    
//댓글 목록조회
router.get("/:postId/comments", async(req,res) =>{
    try {
        const {postId} = req.params;
        
        //post 검색
        const existsPost = await Posts.findOne ({ where :{postId} })
        //# 404 댓글을 작성할 게시글이 존재하지 않는경우
        if(!existsPost){
            return res.status(404).json({ "errorMessage":"게시글이 존재하지 않습니다."});
        }
        const existsComments = await Comments.findAll({
            attributes: ["commentId","UserId", "comment","createdAt", "updatedAt"],
            order: [['createdAt', 'DESC']],
            include:[{
                model : Users,
                attributes: ["userId", "nickname"],
            }]

        })

        res.status(200).json({comments:existsComments});
    } catch (error) {
        res.status(400).json({ "errorMessage":"댓글 조회에 실패하였습니다."+error});
        
    }

})

//댓글 수정
router.put("/:postId/comments/:commentId",authMiddleware, async(req,res) =>{
    try {
        const {postId,commentId} = req.params;
        const {comment} = req.body;
        const { userId } = res.locals.user;
        
        // # 412 body 데이터가 정상적으로 전달되지 않는 경우
        if(typeof comment !== "string" ){
            const messagge = '데이터 형식이 올바르지 않습니다.'
            return res.status(412).json({ "errorMessage":messagge});
        }
       

         // # 404 댓글을 수정할 게시글이 존재하지 않는경우
        const existsPost = await Posts.findOne({ where :{postId} });
        if(!existsPost){
            const messagge = '게시글이 존재하지 않습니다'
            return res.status(404).json({ "errorMessage":messagge});  
        }


        // # 404 댓글이 존재하지 않는경우
        const existComment = await Comments.findOne({ where:{commentId}});
        if(!existComment){
            const messagge = '댓글이 존재하지 않습니다.'
            return res.status(404).json({ "errorMessage":messagge});  
        }    


        // # 403 댓글의 수정 권한이 존재하지 않는 경우        
        const authCheck = await Comments.findOne({ 
            where :{
                [Op.and]: [{ PostId: postId }, { UserId: userId }]
                }
        });
        if(!authCheck){
            const messagge = '댓글의 수정 권한이 존재하지 않습니다.'
            return res.status(403).json({ "errorMessage":messagge});
        }
       
        await Comments.update({comment }, 
            { where :
                {commentId}
            }).then( result => {
              return res.status(200).json({message:"댓글을 수정하였습니다."});
            }).catch(error => {
               return res.status(400).json({errorMessage:"댓글 수정이 정상적으로 처리되지 않았습니다." }) 
            }) 
        
        
    } catch (error) {
        res.status(400).json({ "errorMessage":"댓글 수정에 실패하였습니다."});
    }

})

//댓글삭제
router.delete("/:postId/comments/:commentId", authMiddleware,async(req,res) =>{
    try {
        const {postId,commentId} = req.params;
        const { userId } = res.locals.user;
        
        
        //# 404 댓글을 삭제할 게시글이 존재하지 않는경우
        await Posts.findOne({where:{postId}}).catch(()=>{
            return res.status(404).json({ "errorMessage":"게시글이 존재하지 않습니다."});
        })


        // # 403 댓글의 삭제 권한이 존재하지 않는 경우
        // {"errorMessage": "댓글의 삭제 권한이 존재하지 않습니다."}
        await Comments.findOne(
            {where:{
                    [Op.and]: [{ commentId }, { UserId: userId }]
            }}).catch(()=>{
                return res.status(404).json({ "errorMessage":"댓글의 삭제 권한이 존재하지 않습니다."});
            })
            

        // # 404 댓글이 존재하지 않는경우
        // {"errorMessage": "댓글이 존재하지 않습니다."}
        await Comments.findOne({where:{commentId}}).catch(()=>{
            return res.status(404).json({ "errorMessage":"댓글이 존재하지 않습니다."});
        })

        await Comments.destroy({
                where: {commentId}
            }).then(()=>res.status(200).json({ "message":"댓글을 삭제하였습니다."}) )
            .catch(()=> res.status(400).json({ "errorMessage":"댓글 삭제가 정상적으로 처리되지 않았습니다."}) )
            
        

    } catch (error) {
        res.status(400).json({ "errorMessage":"댓글 삭제에 실패하였습니다."});
    }
})


//====================
module.exports = router;
  