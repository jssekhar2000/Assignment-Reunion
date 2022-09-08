let mongoose = require('mongoose');
    
    let user = mongoose.model('User',{
        name:String,
        email:String,
        password:String,
        followers:{type:Number,default:0,required:true},
        following:{type:Number,default:0,required:true}
    });
    
    module.exports = user;