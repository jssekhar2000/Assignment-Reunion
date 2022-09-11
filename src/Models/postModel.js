let mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId
    
const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    likes: {
        type:Number,
        required:true,
        default:0
    },
    likedUsers:{
        type:[objectId],
        ref:'User',
        default:[]
    },
    userId:{
        type:objectId,
        ref:'User'
    },
    isDeleted:{                      // for Soft Delete But Not Deleted from DB
        type:Boolean,
        default:false
    }
},
{timestamps:true})

    
    module.exports = mongoose.model('Post',postSchema);