const express = require('express');
const route   = express.Router();

route.post('/files',(req,res)=>{
    console.log('uploading...');
    upload(req,res,err=>{
        if(err){
            console.log('Failure in Uploading :(',err);
        } else {
            console.log('Success in Uploading :)');
        }
    });
});

route.get('/uploads',function(req,res){
    res.render('uploads/uploads');
});

module.exports = route;