const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../config/keys.js')

const UserController = {
    async create(req, res) {
        try {
            const password = bcrypt.hashSync(req.body.password, 10)
            const user = await User.create({ ...req.body, password: password })
            res.status(201).send(user)
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'There´s been a problem creating the user' })
        }
    },
    async userData (req,res){
        try {
            console.log("ACA ESTAS");
            console.log(req.user._id);
            const userData = await User.findById(req.user._id)
            console.log(userData);
            res.send ({ message: 'Your information:', userData})
        } catch (error) {
            console.error(error)
            res.status(404).send({ message: 'You must be logged to see your information' })
        }
    },
    async login(req, res) {
        try {
            const user = await User.findOne({
                email: req.body.email,
            })
            if (!user) {
                return res.status(400).send({ message: "User or Password incorrect" })
            }
            const isMatch = bcrypt.compareSync(req.body.password, user.password);
            if (!isMatch) {
                return res.status(400).send({ message: "User or Password incorrect" })
            }
            const token = jwt.sign({ _id: user._id }, jwt_secret);
            if (user.tokens.length > 4) user.tokens.shift();
            user.tokens.push(token);
            await user.save();
            res.send({ message: 'Welcome ' + user.name, token });
        } catch (error) {
            console.error(error);
        }
    },
    async logout(req, res) {
        try {
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { tokens: req.headers.authorization },
            });
            res.send({ message: "Disconected succesfully" });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: "There has been a problem during the disconnection, please try again!",
            });
        }
    },
}

module.exports = UserController;