const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email : {
        type : String,
        required:true
    },
    firstName : {
        type : String,
    },
    lastName : {
        type : String
    },
    image : {
        type : String
    },
    googleId : {
        type: String,
        required : true
    }
})

//create collection and schema
mongoose.model('users',UserSchema)

