const router = require('express').Router();
const authenticate = require('../middleware/auth');
const authRouter = require('./auth-router')
const chatRouter = require("./chat-router")
const messageRouter = require("./message-router")


router.use("/api/auth", authRouter)
router.use("/api/chat", authenticate, chatRouter)
router.use("/api/message", authenticate, messageRouter)
module.exports = router