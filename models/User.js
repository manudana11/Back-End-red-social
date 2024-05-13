const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;


const UserSchema = new mongoose.Schema({
    name: String,
    userName: String,
    email: String,
    password: String,
    dateOfBirth: Date,
    profilePic: String,
    followers: [{type:ObjectId, ref:'User'}],
    posts: [{type:ObjectId, ref:'Post'}],
    comments: [{type:ObjectId, ref:'comment'}],
    tokens: [],
    role:String,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;


