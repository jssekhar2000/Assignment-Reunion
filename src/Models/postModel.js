let mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId
    
    let Post = mongoose.model('Post', {
        title:String,
        desc: String,
        created_at: Date,
        comments:[String],
        likes: Number,
        authorId:{objectId,ref:'User'}
    });
    
    module.exports = Post;