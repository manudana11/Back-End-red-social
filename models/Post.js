const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = new mongoose.Schema({
    imgpost: String,
    caption: String,
    userId: {type:ObjectId, ref:'User'},
    taggedpeople: [],
    likes: [{type:ObjectId, ref:'User'}],
    commentsIds: [{type:ObjectId, ref:'Comment'}],
    location: String,
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;