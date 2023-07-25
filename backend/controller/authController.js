const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const error = require('../utils/error');
const regController = async (req, res, next) => {
    const { name, email, password, picture } = req.body
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Invaliid Data' })
    }
    try {
        const isUser = await User.findOne({ 'email': email })
        if (isUser) {
            throw error("User Exists!!!", 401);
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const user = new User({
            name,
            email,
            password: hash,
            picture
        })
        user.save();
        const payload = {
            name: name,
            email: email,
            picture: picture
        }
        const token = jwt.sign(payload, 'secret-key', { expiresIn: '1h' })
        return res.status(200).json({ message: "new user created", Token: token })
    } catch (error) {
        next(error)
    }
}

const loginController = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ 'email': email });
        if (!user) {
            throw new error("User Not Exists", 404);
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new error("Password is incroccet", 404);
        }
        const payload = {
            _id: user._id,
            name: user.name,
            email: user.email,
        }
        const token = jwt.sign(payload, 'secret-key', { expiresIn: '4h' })
        return res.status(200).json({message: "login success", token: "Bearer " + token });
    } catch (error) {
        //return res.status(404).json({ message: "User may not exists" })
        next(error)
    }

}
module.exports = {
    regController,
    loginController
}