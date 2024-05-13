const express = require('express');
const PostController = require('../controllers/PostController');
const router = express.Router()
const { authentication, isAdmin } = require("../middlewares/authentication");
const { imgLoad } = require('../middlewares/multer');


router.post("/", authentication, imgLoad, PostController.create);
router.get("/", PostController.getAll);
router.put("/id/:_id", authentication, PostController.update);
router.delete("/id/:_id", authentication, PostController.delete);

module.exports = router;