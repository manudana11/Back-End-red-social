const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please complete the name field"],
      }
  ,
    userName: {
        type: String,
        required: [true, "Please complete the username field"],
      }
  ,
    email: {
        type: String,
        match: [/.+\@.+\..+/, "The email is not valid"],
        required: [true, "Please complete the email field"],
      }
  ,
    password: {
        type: String,
        required: [true, "Please complete the password field"],
      },
    dateOfBirth: {
        type: Date,
        required: [true, "Please complete the 'date of birth' field"],
      },
    profilePic: String,
    followers: [{type:ObjectId, ref:'User'}],
    posts: [{type:ObjectId, ref:'Post'}],
    comments: [{type:ObjectId, ref:'comment'}],
    likes:[{type:ObjectId, ref:'Post'}],
    tokens: [],
    role:String,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;


