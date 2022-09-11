const postModel = require('../Models/postModel');
const commentModel = require("../Models/commentModel")
const mongoose = require('mongoose')





//===============================To Check Valid Object Id=============================
const isValidObjectId = (objectId) => {
    if (mongoose.Types.ObjectId.isValid(objectId)) return true;
    return false;
  };


//============================ Add Post Api ========================

const createPost = async (req,res) =>{
    try{
        let data = req.body;

        if (Object.keys(data).length == 0 ){
            return res.status(400).send({status:false ,msg:"Invalid Request,Please provide Post details "});
          }

        if(!data.title){
            return res.status(400).send({status:false,messaage:"Title is Mandatory"})
        }
        if(!data.description){
            return res.status(400).send({status:false,messaage:"Description is Mandatory"})
        }

        data.userId = req.userId
    let savedPost = await postModel.create(data)
    return res.status(201).send({status:true,Post:{PostId:savedPost._id,
    Title:savedPost.title,Description:savedPost.description,CreatedTime:savedPost.createdAt}})

    }
    catch(error){
        return res.status(500).send({status:false , msg: error.message})
    }
}



// ====================================Delete Post Api====================================

const deletePost = async (req,res) =>{
    try{
        let postId = req.params.id
        let userId = req.userId
         
        if(!isValidObjectId(postId)){
            return res.status(400).send({status:false,message:"Invalid Post ID"})
        }
        let findPost = await postModel.findById(postId);

        if(findPost.isDeleted==true){
            return res.status(404).send({status:false,message:'Post Not Found'})
        }

        if(userId != findPost.userId){
            return res.status(403).send({status:false,message:"You are Not Authorized"})
        }
        await postModel.findOneAndUpdate({_id:postId,isDeleted:false},{isDeleted:true},{new:true})
        return res.status(200).send({status:true,message:"Post Sucessfully Deleted"})

    }
    catch(error){
        return res.status(500).send({status:false , msg: error.message})
    }
}



//================================ Like Post Api ===========================================

const like = async (req,res) =>{
    try{
        let postId = req.params.id
        let userId = req.userId
        if(!isValidObjectId(postId)){
            return res.status(400).send({status:false,message:"Invalid Post ID"})
        }

        let postDetails = await postModel.findOne({_id:postId,isDeleted:false})

        if(!postDetails){
         return res.status(404).send({status:false,message:"Post Not Found"})
        }
        let alreadyLike = postDetails.likedUsers
        let check = alreadyLike.includes(userId)
        if(check){
            return res.status(403).send({status:false,messaage:"You are already Liked this Post"})
        }

        await postModel.findOneAndUpdate({_id:postId},{$inc:{likes:1},$addToSet:{likedUsers:userId}},{new:true})

        return res.status(200).send({status:true,messaage:"Liked Sucessfully"})

    }
    catch(error){
        return res.status(500).send({status:false , msg: error.message})
    }
}



//===============================Unlike Post Api============================================

const unlike = async (req,res) =>{
    try{
        let postId = req.params.id
        let userId = req.userId;
    
        if(!isValidObjectId(postId)){
            return res.status(400).send({status:false,message:"Invalid Post ID"})
        }

    let postDetails = await postModel.findOne({_id:postId,isDeleted:false});
    
    if(!postDetails){
        return res.status(404).send({status:false,message:"Post Not Found"})
       }

       let alreadyLike = postDetails.likedUsers
       let check = alreadyLike.includes(userId)
       if(!check){
           return res.status(403).send({status:false,messaage:"You are not Liked this Post"})
       }

       await postModel.findOneAndUpdate({_id:postId},{$inc:{likes:-1},$pull:{likedUsers:userId}},{new:true})
       
       return res.status(200).send({status:true,messaage:"Unliked Sucessfully"}) 
    }

    catch(error){
        return res.status(500).send({status:false , msg: error.message})
    }
} 



// ================================= Comment Post Api=================================

const comment = async (req,res) =>{
    try{
        let data = req.body
        let userId = req.userId
        let postId = req.params.id

        if(!isValidObjectId(postId)){
            return res.status(400).send({status:false,message:"Invalid Post ID"})
        }
        if(!data.comment){
            return res.status(400).send({status:false,message:"Empty Comment Not Allowed"})
        }

        let postDetails = await postModel.findOne({_id:postId,isDeleted:false})
        
        if(!postDetails){
            return res.status(404).send({status:false,message:"Post Not Found"})
        }
        data.userId = userId
        data.postId = postId
    
        let savedComment = await commentModel.create(data);

        return res.status(201).send({status:true,CommentID:savedComment._id})

    }
    catch(error){
        return res.status(500).send({status:false , msg: error.message})
    }
}



// =================================== Get Post Api=========================================

const getPost = async (req,res) =>{
    try{
        let postId = req.params.id

        if(!isValidObjectId(postId)){
            return res.status(400).send({status:false,message:"Invalid Post ID"})
        }

        let findPost = await postModel.findOne({_id:postId,isDeleted:false})

        if(!findPost){
            return res.status(404).send({status:false,message:"Post Not Found"})
        }
    
        let findComment = await commentModel.find({postId}).select({__v:0,updatedAt:0,createdAt:0,postId:0})

        let postDetails={
            ID : findPost._id,
            UserID : findPost.userId,
            Title : findPost.title,
            Description : findPost.description,
            CreatedAt: findPost.createdAt,
            Likes: findPost.likes,
            TotalComments : findComment.length,
            comments : findComment
        }

        return res.status(200).send({status:true,PostDetails:postDetails})

    }
    catch(error){
        return res.status(500).send({status:false , msg: error.message})
    }
}



// ======================================= Get All Posts Api ===============================

const getPosts = async (req,res) =>{
    try{
        let userId = req.userId

        let foundPosts = await postModel.find({userId:userId,isDeleted:false}).select({__v:0,updatedAt:0,likedUsers:0,isDeleted:0,userId:0}).sort({createdAt:1});
        //let foundComments = await commentModel.find({useId:userId})
        // for(let i=0;i<foundPosts.length;i++){
        //     let postId = foundPosts[i]._id
        //     //console.log(postId)
        //     let comments = foundComments.filter((n)=> {console.log(n.postId===postId);if(n.postId == postId){return n}})
        //     //console.log(comments)
        //     foundPosts.comments = comments
        // }
        return res.status(200).send({status:true,Posts:foundPosts})

    }
    catch(error){
        return res.status(500).send({status:false , msg: error.message})
    }
}






module.exports ={createPost,deletePost,like,unlike,comment,getPost,getPosts}