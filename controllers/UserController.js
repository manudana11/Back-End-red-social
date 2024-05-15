const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys.js');
const { transporter } = require("../config/nodemailer.js");

const UserController = {
    async create(req, res) {
        try {
            const userName = req.body.userName;
            const email = req.body.email;
            const userExists = await User.findOne({ userName });
            const emailExists = await User.findOne({ email });
            const url = `http://localhost:3000/users/confirm/${req.body.email}`;
            if (!req.body.password) {
                return res.status(400).send({ message: "Please, complete the password field" })
            }
            if (userExists || emailExists) {
                return res.status(400).send({ message: "The email or username is already taken" })
            } else if (!req.file) {
                const password = bcrypt.hashSync(req.body.password, 10)
                const user = await User.create({ ...req.body, password, role: "user" })
                await transporter.sendMail({
                    to: req.body.email,
                    subject: "Confirm your email",
                    html: `<h3>Confirm your email</h3>
                    <a href="${url}">Click to confirm</a>
                    `,
                })
                res.status(201).send(user)
            } else {
                const profilePic = req.file.path;
                const password = bcrypt.hashSync(req.body.password, 10)
                const user = await User.create({ ...req.body, password, role: "user", profilePic })
                await transporter.sendMail({
                    to: req.body.email,
                    subject: "Confirm your email",
                    html: `<h3>Confirm your email</h3>
                    <a href="${url}">Click to confirm</a>
                    `,
                })
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
            .populate("posts.postId")
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
                const update = { ...req.body, password: req.user.password, role: req.user.role, profilePic: req.user.profilePic}
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
    async followers(req, res) {
        try {//Agregar limitador de 1
          const follower = await User.findByIdAndUpdate(
            req.params._id,
            { $push: { followers: req.user._id } },
            { new: true }
          );
          await User.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.params._id } },
            { new: true }
          );
          res.send(follower);
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "There was a problem when you followed the user" });
        }
      },
      //Unfollow
      async recoverPassword(req, res) {
        try {
          const recoverToken = jwt.sign({ email: req.params.email }, JWT_SECRET, {
            expiresIn: "48h",
          });
          const url = "http://localhost:3000/users/resetPassword/" + recoverToken;
          await transporter.sendMail({
            to: req.params.email,
            subject: "Recuperar contraseña",
            html: `<h3> Recuperar contraseña </h3>
            <a href="${url}">Recuperar contraseña</a>
            El enlace expirará en 48 horas
            `,
          });
          res.send({
            message: "Un correo de recuperación se envio a tu dirección de correo",
          });
        } catch (error) {
          console.error(error);
        }
      },
      async resetPassword(req, res) {
        try {
          const recoverToken = req.params.recoverToken;
          const payload = jwt.verify(recoverToken, JWT_SECRET);
          const password = bcrypt.hashSync(req.body.password,10)
          await User.findOneAndUpdate(
            { email: payload.email },
            { password }
          );
          res.send({ message: "contraseña cambiada con éxito" });
        } catch (error) {
          console.error(error);
        }
      },
}

module.exports = UserController;