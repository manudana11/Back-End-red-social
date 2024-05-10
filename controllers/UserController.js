const User = require("../models/User");

const UserController ={
    async create(req,res){
        try {
            const user = await User.create(req.body)
            res.status(201).send(user)
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'There´s been a problem creating the user' })
        }
    },
}
module.exports = UserController;