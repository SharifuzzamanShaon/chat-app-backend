const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, require: true},
    password: { type: String, required: true },
    picture: { type: String}
},
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User 