const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

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
            await Post.findByIdAndUpdate(req.params._id, { $push: { commentsIds: createComment._id } })
            res.status(201).send({ message: `${req.user.name} created a comment successfully.`, createComment })
        } catch (error) {
            console.error(error);
			res.status(500).send({ message: "Error during post creation.", error });
        }
    },
    async update(req, res) {
        try {
          const comment = await Comment.findByIdAndUpdate(req.params._id, req.body, { new: true })
          res.send({ message: "comment successfully updated", comment });
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: 'There was a problem trying to update the comment'})
        }
      },
      async delete(req, res) {
        try {
            const comment = await Comment.findByIdAndDelete(req.params._id)
            res.send({ message: 'Comment deleted', comment })
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: 'There was a problem trying to remove the comment'})
        }
    },
    async like(req, res) {
        try {
          const likeExist = await Comment.findOne({ _id:req.params._id, likes:req.user._id });
          if (likeExist) {
            return res.status(400).send({ message: "You alrready like this comment"});
          }
          const comment = await Comment.findByIdAndUpdate(
            req.params._id,
            { $push: { likes: req.user._id } },
            { new: true }
          );
          console.log(comment);
          res.send(comment);
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "There was a problem with your like" });
        }
      },
      async dislike(req, res) {
        try {
          const likeExist = await Comment.findOne({ _id:req.params._id, likes:req.user._id });
          if(!likeExist) {
            return res.status(400).send({ message: "You have not like this comment"});
          };
          const comment = await Comment.findByIdAndUpdate(
            req.params._id,
            { $pull: { likes: req.user._id } },
            { new: true }
        );
        res.send(comment);
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "There was a problem with your like" });
        }
      },
      async addResponse(req, res) {
        try {
            const comment = await Comment.findById(req.params._id);
            if (!comment) {
                return res.status(404).send({ message: 'Comment not found' });
            }
            const response = {
                userId: req.user._id,
                bodyText: req.body.bodyText,
                likes: [],
            };
            comment.responses.push(response);
            const updatedComment = await comment.save();
            res.send({ message: "Response added successfully", updatedComment });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Error adding response to comment" });
        }
    },
};

module.exports = CommentController;