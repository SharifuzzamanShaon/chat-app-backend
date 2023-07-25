const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");
const error = require("../utils/error");


const accessChat = async (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.userInfo._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    // isChat = await User.populate(isChat, {
    //     path: "latestMessage.sender",
    //     select: "name picture email",
    // });
    // console.log(isChat);
    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.userInfo._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
}

const fetchChats = async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.userInfo._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
           .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name picture email",
                });
                res.status(200).send(results);
            })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}
const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        res.status(400).json({ message: "insert name and users" })
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(200).json({ message: "More then 2 users needed to create the group" })
    }
    users.push(req.userInfo);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true
        })
        const fullGroup = await Chat.findOne({ _id: groupChat._id })
        return res.status(200).json(fullGroup)
    } catch (error) {
        next(error);
    }
}

const renameGroup = async (req, res) => {
    const { chatName, id } = req.body;
    const updateChat = await Chat.findByIdAndUpdate(id, { chatName }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!updateChat) {
        throw error("Chat not found", 400);
    }
    else {
        res.json(updateChat)
    }
}

const addToGroup = async (req, res) => {
    const id = req.body.id;
    const userId = req.body.userId

    const addedUsers = await Chat.findByIdAndUpdate(id, {
        $push: { users: userId }
    },
        {
            new: true
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!addedUsers) {
        return res.status(400).json({ message: "not found group" })
    } else {
        return res.json(addedUsers)
    }
}

const removeUser = async (req, res) => {
    const { id, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(id, { $pull: { users: userId } }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!removed) {
        return res.status(400).json({ message: "user not found user" })
    } else {
        return res.status(200).json(removed);
    }
}

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeUser }