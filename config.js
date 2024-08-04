const mongoose = require("mongoose")
const connect = mongoose.connect("mongodb://localhost:27017/test");

connect.then(() => {
    console.log("Database Connected SuccessFully.");
})
.catch(() => {
    console.log("Database Connection Failed.");
})

const LoginSchema = new mongoose.Schema({
    username:{
        type:String
    },
    email:{
    type: String,
    required: true,
    unique: true
    },
    password:{
        type:String,
        required: true
    },
    address:{
        type:String
    },
    landmark:{
        type:String
    },
    csz:{
        type:String
    },
    isLogin:{
        type:Boolean
    },
    img:{
        type:String
    }
});

const collection = new mongoose.model("users",LoginSchema);

module.exports = collection



