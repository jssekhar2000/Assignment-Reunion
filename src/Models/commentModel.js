const mongoose = require('mongoose')
const objectId = mongoose.SchemaTypes.ObjectId

const commentSchema = new mongoose.Schema({
    comment: {
        type: String, 
        required: true, 
        trim: true
    },
    userId: {
        type: objectId,
        ref: 'User'
    },
    postId: {
        type: objectId,
        ref: 'Post'
    }
},
{timestamps:true})

module.exports = mongoose.model('Comments', commentSchema)

