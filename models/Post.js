const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: ObjectId,
    title: String,
    imgpost: String,
    date: Date,
    taggedpeople: Array,
    likes: Array,
    comments: Array,
    location: String,
}, { timestamps: true });

const Post = mongoose.model('User', PostSchema);

module.exports = Post;
