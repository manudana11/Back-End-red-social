const CommentController = require("../controllers/CommentController");

const express = require('express');
const { authentication, isAuthor } = require("../middlewares/authentication");
const router = express.Router();

router.post("/id/:_id", authentication, CommentController.create);

module.exports = router;