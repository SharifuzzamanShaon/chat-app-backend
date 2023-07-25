const router = require('express').Router();
const { regController, loginController } = require('../controller/authController');
const allUsers = require('../controller/userController');
const authenticate = require('../middleware/auth');

router.post("/reg", regController);
router.post("/login", loginController);
router.get("/get-users",authenticate,allUsers)
module.exports = router