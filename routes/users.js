const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router()
const { authentication, isAdmin } = require("../middlewares/authentication");
const { imgLoad } = require("../middlewares/multer");

router.post('/',imgLoad,UserController.create)
router.get('/', authentication, UserController.userData)
router.post('/login',UserController.login)
router.delete('/logout',authentication, UserController.logout)


module.exports = router;

