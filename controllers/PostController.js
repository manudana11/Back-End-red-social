const Post = require("../models/Post");

const PostController = {
    async create(req, res) {
        try {
            const post = await Post.create(req.body)
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