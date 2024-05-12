const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    userName: String,
    email: String,
    password: String,
    dateOfBirth: Date,
    followers: Array,
    profilePic: String,
    posts: Array,
    comments: Array,
    tokens: [],
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;


