const jwt = require("jsonwebtoken");
const { findById } = require("../models/UserModel");
const User = require("../models/UserModel")
const authenticate = async (req, res, next) => {
    let token = req.headers.authorization
    try {
        if (!token) {
            return res.status(400).json({ message: 'Unauthorized User' })
        }
        token = token.split(" ")[1];

        token = jwt.verify(token, 'secret-key');
        if (!token) {
            throw new Error("Token is not valid")
        }
        const user = await User.findById(token._id);
        if (!user) {
            throw new Error("User not authorized");
        }
        const userInfo ={
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture
        }
        req.userInfo = userInfo;
        next();
    } catch (error) {
        next(error)
    }

}

module.exports = authenticate