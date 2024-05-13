const Post = require("../models/Post");

const PostController = {
    async create(req, res) {
        try {
            console.log(
                req.user._id
            );
            const user = ({...req.body, userId: req.user._id})
            const post = await Post.create(user)
            res.status(201).send({ msg: `${req.user.name} created post successfully.`, post })
        } catch (error) {
            console.error(error);
			res.status(500).send({ msg: "Error during post creation.", error });
        }
    },
    async getAll(req, res) {
        try {
            const posts = await Post.find();
            res.send(posts);
        } catch (error) {
            console.error(error);
			res.status(500).send({ msg: "Something  went wrong.", error });
        }
    }
};

module.exports = PostController;