const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaType.ObjectId;

const PostSchema = new mongoose.Schema({
    imgpost: String,
    caption: String,
    userId: [{type:ObjectId, ref:'User'}],
    taggedpeople: [{type:ObjectId, ref:'Tagged'}],
    likes: [{type:ObjectId, ref:'Likes'}],
    comments: [{
        userId: {type:ObjectId, ref:'User'},
        bodyText: String,
        likes: [{type:ObjectId, ref:'User'}],
        responses: [{
            userId: {type:ObjectId, ref:'User'},
            bodyText: String,
            likes: [{type:ObjectId, ref:'User'}],
        }],
    }],
    location: String,
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;