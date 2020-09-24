const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    userId : {
        type : String,
        required:true
    },
    email : {
        type : String
    },
    productBought:[],
    price : {
        type : String,
    },
    image : {
        type : String
    },
    boughtDate : {
        type : Date,
        required : true
    }

})

//create collection and schema
mongoose.model('productSchema',ProductSchema)

