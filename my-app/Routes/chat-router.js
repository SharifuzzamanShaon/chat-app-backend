const {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeUser} = require('../controller/chatController')

const router = require('express').Router()

router.post("/", accessChat)
router.get("/", fetchChats)
router.post("/group", createGroupChat)
router.put("/rename", renameGroup)
router.post("/add-to-group", addToGroup)
router.put("/group-remove", removeUser)


module.exports = router