const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
    userId : {
        type : String,
        required:true
    },
    email : {
        type : String
    },
    avatar:{
        type:String
    },
    firstName : {
        type : String
    },
    lastName : {
        type : String
    },
    like : {
        type : Number,
    },
    productId : {
        type : String
    },
    viewDate : {
        type : Date,
        required : true
    },
    likeDate : {
        type : Date,
    }
});

//create collection and schema
mongoose.model('likeSchema',LikeSchema)

