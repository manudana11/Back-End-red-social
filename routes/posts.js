const express = require('express');
const PostController = require('../controllers/PostController');
const router = express.Router()

router.post("/", PostController.create);
router.get("/", PostController.getAll);

module.exports = router;