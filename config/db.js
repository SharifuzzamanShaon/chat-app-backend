const { default: mongoose } = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://shaon1:123456shaon@cluster0.0sunkhy.mongodb.net/?retryWrites=true&w=majority");
        console.log("DB connected");
    } catch (error) {
        console.log(error);
    }
}
module.exports = connectDB