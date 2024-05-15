const CommentController = require("../controllers/CommentController");

const express = require('express');
const { authentication, isYourComment } = require("../middlewares/authentication");
const router = express.Router();

router.post("/id/:_id", authentication, CommentController.create);
router.put("/id/:_id", authentication, isYourComment, CommentController.update)

module.exports = router;