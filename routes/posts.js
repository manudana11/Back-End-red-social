const express = require('express');
const PostController = require('../controllers/PostController');
const router = express.Router()
const { authentication, isAdmin } = require("../middlewares/authentication");


router.post("/", authentication, PostController.create);
router.get("/", PostController.getAll);

module.exports = router;