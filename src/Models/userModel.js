let mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId
    

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        trim: true
    },
    email: {
        type: String, 
        required: true, 
        unique:true, 
        trim: true, 
        lowercase: true
    },
    password: {
        type: String, 
        required: true,
        minLength:3
    },
    followers: {
        type: [objectId], 
        ref: 'User',
        default:[]
    },
    followings: {
        type: [objectId], 
        ref: 'User',
        default:[]
    }
},
{timestamps:true})
    
    module.exports = mongoose.model('User',userSchema);