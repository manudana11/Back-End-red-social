const Post = require("../models/Post");

const PostController = {
    async create(req, res) {
        try {
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
            const { page = 1, limit = 10 } = req.query;
            const posts = await Post.find().limit(limit).skip((page - 1) * limit);
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
      async getById(req, res) {
        try {
          const post = await Post.findById(req.params._id);
          res.send(post);
        } catch (error) {
          console.error(error);
        }
      },
      async getPostByName(req, res) {
        try {
          if (req.query.caption.length>20){
            return res.status(400).send('Búsqueda demasiado larga')
          }
          const caption = new RegExp(req.query.caption, "i");
          const post = await Post.find({caption});
          res.send(post);
        } catch (error) {
          console.log(error);
        }
      },
    
};

module.exports = PostController;