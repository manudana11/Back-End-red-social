const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys.js')

const UserController = {
    async create(req, res) {
        try {
            const userName = req.body.userName;
            const email = req.body.email;
            const userExists = await User.findOne({ userName });
            const emailExists = await User.findOne({ email });
            if (!req.body.password) {
                return res.status(400).send({ message: "Please, complete the password field" })
            }
            if (userExists || emailExists) {
                return res.status(400).send({ message: "The email or username is already taken" })
            } else if (!req.file) {
                const password = bcrypt.hashSync(req.body.password, 10)
                const user = await User.create({ ...req.body, password, role: "user" })
                res.status(201).send(user)
            } else {
                const profilePic = req.file.path;
                const password = bcrypt.hashSync(req.body.password, 10)
                const user = await User.create({ ...req.body, password, role: "user", profilePic })
                res.status(201).send(user)
            }
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'There´s been a problem creating the user', error })
        }
    },
    async getAll(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query
            const users = await User.find()
            .populate("posts.userId")
            .limit(limit)
            .skip((page - 1) * limit);
            res.send({ message: 'Users', users })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'There´s been a problem searching all the users' })
        }
    },
    async userData(req, res) {
        try {
            const userData = await User.findById(req.user._id)
            res.send({ message: 'Your information:', userData })
        } catch (error) {
            console.error(error)
            res.status(400).send({ message: 'You must be logged to see your information' })
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
            const token = jwt.sign({ _id: user._id }, JWT_SECRET);
            if (user.tokens.length > 4) user.tokens.shift();
            user.tokens.push(token);
            await user.save();
            res.send({ message: 'Welcome ' + user.name, token });
        } catch (error) {
            console.error(error);
            res.status(500).send(error)
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
    async update(req, res) {
        try {
            if (!req.file) {
                const update = { ...req.body, password: req.user.password, role: req.user.role}
                const user = await User.findByIdAndUpdate(
                    req.user._id,
                    update,
                    { new: true }
                )
                res.send({ message: "user successfully updated", user });;
            } else {
                const profilePic = req.file.path;
                const update = { ...req.body, password: req.user.password, role: req.user.role, profilePic}
                const user = await User.findByIdAndUpdate(
                    req.user._id,
                    update,
                    { new: true }
                );
                res.send({ message: "user successfully updated", user });
            }
        } catch (error) {
            console.error(error);
        }
    },
}

module.exports = UserController;