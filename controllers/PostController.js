const Post = require("../models/Post");

const PostController = {
    async create(req, res) {
        try {
            console.log(req.user._id);
            const imgpost = req.file.path;
            const user = ({...req.body, imgpost, userId: req.user._id})
            const post = await Post.create(user)
            res.status(201).send({ message: `${req.user.name} created post successfully.`, post })
        } catch (error) {
            console.error(error);
			res.status(500).send({ message: "Error during post creation.", error });
        }
    },
    async getAll(req, res) {
        try {
            const posts = await Post.find();
            res.send(posts);
        } catch (error) {
            console.error(error);
			res.status(500).send({ message: "Something  went wrong.", error });
        }
    },
    async update(req, res) {
        try {
          const post = await Post.findByIdAndUpdate(
            req.params._id,
            {...req.body, userId: req.user._id, },
            { new: true }
          );
          res.send({ message: "Post successfully updated", post });
        } catch (error) {
          console.error(error);
        }
      },
      async delete(req, res) {
        try {
          const post = await Post.findByIdAndDelete(req.params._id);
          res.send({ message: "Post deleted", post });
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "There was a problem trying to remove the post" });
        }
      },
};

module.exports = PostController;