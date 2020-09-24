const express = require('express')
const route = express.Router()


route.get('/',(req,res)=>{
   // console.log('/dashboard')
    res.render('index/welcome')
})

module.exports = route
