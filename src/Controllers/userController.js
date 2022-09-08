const userModel = require('../Models/userModel');
const jwt = require('jsonwebtoken');              // import jsonwebtoken to generate token


//==================================================================

const isValidEmail = function(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email) 
  
}

//======================================================

const createUser = async (req,res)=>{
    try{ 
      let data = req.body;
      
      if (Object.keys(data).length == 0 ){
        return res.status(400).send({status:false ,msg:"Invalid REQUEST,Please provide User details "});
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
      if (!isValidEmail(data.email)){
        return res.status(400).send({status:false ,msg:"Enter a Valid Email"});
      }
  
      const usedEmail = await userModel.findOne({email:data.email})  //For checking duplicate email id
  
      if (usedEmail){
        return res.status(400).send({status:false ,message: `${data.email} this email is already registered`})
      }
      let savedData = await userModel.create(data)
        return res.status(201).send({status:true , msg:savedData});
    }
    catch(error){
        console.log("This is the error:",error.message );
        res.status(500).send({status:false , msg: error.message});
    }
  }


  const login = async(req,res)=>{
    try{
        let data = req.body;
        if(!Object.keys(data).length){
              return res.status(400).send ({status: false,msg:"Invalid Request , Please Provide Login Details"})
        }
        if (data.email && data.password){
          let author = await userModel.findOne({email:data.email,password:data.password})
          if(!author){
            return res.status(400).send({status:false,msg:"Invalide email or password"});
          }
          let token = jwt.sign(
              {
                  authorId: author._id.toString(),
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
        res.status(500).send({status:false,error: error.message})
    }
  }






  module.exports = {createUser,login}