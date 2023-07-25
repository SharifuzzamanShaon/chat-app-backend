const { sendMessage, allMessages } = require("../controller/messageController")

const router = require("express").Router()

router.post("/", sendMessage)
router.get("/:chatId", allMessages)


module.exports = router