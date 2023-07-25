const Chat = require("../models/ChatModel");
const Message = require("../models/MessageModel");
const User = require("../models/UserModel");

const sendMessage = async (req, res) => {
    const { content, chatId } = req.body

    if (!content || !chatId) {
        console.log("Invalid data Passed into req.");
        return res.status(400);
    }

    var newMessage = {
        sender: req.userInfo._id,
        content: content,
        chat: chatId
    }
    try {
        var message = await Message.create(newMessage)
        message = await message.populate("sender", "name picture email")
        message = await message.populate("chat")
        // message = await User.populate(message, {
        //     path: "chat.users",
        //     select: "name picture email"
        // });
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })
        res.json(message)
    } catch (error) {
        res.status(400)
        console.log(error);
    }
}
const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name picture email")
            .populate("chat")
        res.json(messages)
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
}


module.exports = {
    sendMessage,
    allMessages
}