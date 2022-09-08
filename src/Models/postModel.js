let mongoose = require('mongoose');
    
    let Post = mongoose.model('Post', {
        title:String,
        desc: String,
        created_at: Date,
        comments:[String],
        likes: Number,
        author: String
    });
    
    module.exports = Post;