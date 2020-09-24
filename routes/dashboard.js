const express = require('express')
const app = express()
const route = express.Router()
const fs = require('fs');
const { ensureAuthentication } = require('../helpers/auth')

route.get('/',ensureAuthentication,(req,res)=>{
    fs.readFile('./products.json','utf8',function(err,data){
        if(err){
            console.log('Error in reading products json file ',err);
            res.status(500).end();
        } else {
           // console.log('data is ',data);
            res.render('dashboard/products',{
                products : JSON.parse(data),
                isCart : true
            });
        }
    })
   
})

module.exports = route


