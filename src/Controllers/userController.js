const userModel = require('../Models/userModel');
const jwt = require('jsonwebtoken');              // import jsonwebtoken to generate token
const bcrypt = require('bcrypt');
const mongoose = require("mongoose")

//==================================================================
// Email VAlidation Regex
const isValidEmail = function(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email) 
  
}
// to check valid ObjectId
const isValidObjectId = (objectId) => {
  if (mongoose.Types.ObjectId.isValid(objectId)) return true;
  return false;
};

//=============================Create User Api=====================================

const createUser = async (req,res)=>{
    try{ 
      let data = req.body;
      
      if (Object.keys(data).length == 0 ){
        return res.status(400).send({status:false ,msg:"Invalid Request,Please provide User details "});
      }
      if (!data.name){
        return res.status(400).send({status:false ,msg:"Name is Mandatory"});
      }
      
      if (!data.email){
        return res.status(400).send({status:false ,msg:"email is mandatory"});
      }
      if (!data.password){
        return res.status(400).send({status:false ,msg:"password is mandatory"});
      }

      let encryptPassword = await bcrypt.hash(data.password, 12);
      data.password = encryptPassword;

      if (!isValidEmail(data.email)){
        return res.status(400).send({status:false ,msg:"Enter a Valid Email"});
      }
  
      const usedEmail = await userModel.findOne({email:data.email})  //For checking duplicate email id
  
      if (usedEmail){
        return res.status(400).send({status:false ,message: `${data.email} this email is already registered`})
      }
      let savedData = await userModel.create(data)
        return res.status(201).send({status:true , msg:'User Sucessfully registered'});
    }
    catch(error){
        
        return res.status(500).send({status:false , msg: error.message});
    }
  }

//==========================LogIn User Api======================================

  const login = async(req,res)=>{
    try{
        let data = req.body;
        if(!Object.keys(data).length){
              return res.status(400).send ({status: false,msg:"Invalid Request , Please Provide Login Details"})
        }
        if (data.email && data.password){
          let user = await userModel.findOne({email:data.email})
          if(!user){
            return res.status(400).send({status:false,msg:"Invalide email"});
          }
          const match = await bcrypt.compare(data.password, user.password);
          if(!match){
            return res.status(400).send({ status: false, message: "Invalid Password" })
          }
          let token = jwt.sign(
              {
                  userId: user._id.toString(),
                  projectName: "assignment-reunion"
              },
              "reunion"
          ) 
          res.header('x-api-key',token);
          res.status(200).send({data:"User login successful",token:{token}})
        } 
        else{
          res.status(400).send({status:false,msg:"must contain email and password"})
        }
    }catch(error){
        return res.status(500).send({status:false,error: error.message})
    }
  }





  //=============================== Follow User Api===================================

  const follow = async (req,res) =>{
    try{
      let myId = req.userId;
      let userId = req.params.id

      if(!isValidObjectId(userId)){
        return res.status(400).send({status:false,message:"Invalid User ID"})
    }

      if(userId === myId){
            return res.status(400).send({status:false,msg: "You are not allow to follow/unfollow your own profile."})
          }
      let wantToFollow = await userModel.findById(userId);
      if(!wantToFollow){
        return res.status(404).send({status:false,message:'User Not Exist'});
      }
      let followers = wantToFollow.followers
        let alreadyFollow = followers.includes(myId)
      if(alreadyFollow){
        return res.status(400).send({status:false,message:"Yuo are Already Following This User"})
      }

      await userModel.findOneAndUpdate({_id:userId},{$addToSet:{followers:myId}},{new:true})
      await userModel.findOneAndUpdate({_id:myId},{$addToSet:{followings:userId}},{new:true})

      return res.status(200).send({status:true,message:'Following Sucessfull'})
        
        }
    catch(error){
      return res.status(500).send({status:false,error: error.message})
    }
  }



  //=================================Unfollow User Api=================================

  const unfollow = async (req,res) =>{
    try{
      let myId = req.userId;
      let userId = req.params.id

      if(!isValidObjectId(userId)){
        return res.status(400).send({status:false,message:"Invalid User ID"})
    }
    
      if(userId === myId){
        return res.status(400).send({status:false,msg: "You are not allow to follow/unfollow your own profile."})
      }

      let unfollowProfile = await userModel.findById(userId)
      if(!unfollowProfile){
        return res.status(404).send({status:false,message:'User Not Exist'});
      }
      let followers = unfollowProfile.followers;

      let followed = followers.includes(myId)
      if(!followed){
        return res.status(400).send({status:false,message:'You are Not Following This User'})
      }
      await userModel.findOneAndUpdate({_id:userId},{$pull:{followers:myId}},{new:true})
      await userModel.findOneAndUpdate({_id:myId},{$pull:{followings:userId}},{new:true})

     return res.status(200).send({status:false,message:"Unfollow Sucessfull"})

    }
    catch(error){
      return res.status(500).send({status:false,error: error.message})
    }
  }



  //==========================   Get User profile Api   =======================================

  const getProfile = async (req,res) =>{
    try{
      let userId = req.userId;

      let userProfile = await userModel.findById({_id:userId}).select({_id:0, createdAt:0, updatedAt:0, __v:0,password:0})
    if(!userProfile){
      return res.status(404).send({status:false,message:'User Not Found'})
    }
    let profile = {Name:userProfile.name,Followers:userProfile.followers.length,Followings:userProfile.followings.length}
    return res.status(200).send({status:true,profile:profile})
    }
    catch(error){
      return res.status(500).send({status:false,error: error.message})
    }
  }






  module.exports = {createUser,login,follow,unfollow,getProfile}