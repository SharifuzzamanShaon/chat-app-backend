const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const chats = require('./data/chats');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const dotenv = require('dotenv')
const cors = require('cors');
const routes = require('./Routes/index');
const authenticate = require('./middleware/auth');
const Chat = require('./models/ChatModel');
dotenv.config();

app.use(cors({
    origin: "*",
}))


app.use(routes)

app.get("/", (req, res) => {
    return res.send("Completed 5");
})
app.get("/api/all-chats", (req, res) => {
    res.status(200).send(chats);
})

app.get("/access-chats", authenticate, async (req, res, next) => {
    // next();
    return res.status(200).send(req.userInfo)

})

app.use((error, req, res, next) => {
    const message = error.message ? error.message : 'Server error occured'
    const status = error.status ? error.status : 500
    res.status(status).send(message)
})

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, async () => {
    await connectDB();
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "https://cosmic-puffpuff-852798.netlify.app/",
    }
})

io.on("connection", (socket) => {
    console.log("Connected to socket oi");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room: " + room);
    });
    socket.on("new message", (newMessageRecieved) => {
        const chat = newMessageRecieved.chat;
        if (!chat) {

            console.log("User not defined");
            return 
        }
        chat.users.forEach((user) => {
            console.log(`USER:${user}`);

           if (user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message received", newMessageRecieved);
            console.log(newMessageRecieved);
        })
    })
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
