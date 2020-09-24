const express = require('express')
const route = express.Router()
const path = require('path')
const { ensureAuthentication } = require('../helpers/auth')

//console.log("what you want ",ensureAuthentication)

route.get('/',ensureAuthentication,(req,res) => {
    res.render('stories/index')
})

route.get('/add',ensureAuthentication,(req,res)=>{
    res.render('stories/add')
})

route.get('/edit',ensureAuthentication,(req,res)=>{
    res.render('stories/edit')
})

route.get('/show',ensureAuthentication,(req,res)=>{
    res.render('stories/show')
})

route.get('/:product_name',(req,res)=>{
    res.render('dashboard/singleproduct',{
        product_name : req.params.product_name,
        product_image : path.join('/images/',req.params.product_name+'.jpg')
    })
})

module.exports = route

