const postModel = require('../Models/postModel');




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








module.exports ={createPost}