const Comment = require("../models/Comment");
const Post = require("../models/Post");

const CommentController = {
    async create(req, res) {
        try {
            if (!req.user || !req.user._id) {
                return res.status(400).send({ message: "User not authenticated." });
            };

            if (!req.params._id) {
                return res.status(400).send({ message: "Post ID is required." });
            };
            const comment = {
                ...req.body,
                userId: req.user._id,
                postId: req.params._id
            };
            const createComment = await Comment.create(comment);
            console.log(req.params._id);
            console.log(comment)
            await Post.findByIdAndUpdate(req.params._id, { $push: { commentsIds: createComment._id } })
            res.status(201).send({ message: `${req.user.name} created a comment successfully.`, createComment })
        } catch (error) {
            console.error(error);
			res.status(500).send({ message: "Error during post creation.", error });
        }
    },
};

module.exports = CommentController;