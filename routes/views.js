const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
require('../modal/likemodal');
const ViewsSchema = mongoose.model('likeSchema');
const { ensureAuthentication } = require('../helpers/auth');

function fnprepareViewUsers(datas){

    const users = [];
    
    datas.forEach(data => {
        const user = {};
        user['firstName'] = data.firstName;
        user['email'] = data.email;
        user['lastName'] = data.lastName;
        user['avatar'] = data.avatar;
        user['like'] = data.like;

        users.push(user);
    });

    return JSON.stringify(users);

}

route.post('/like',ensureAuthentication,(req,res)=>{

    
    const productId = req.body.productId;
    const userId = req.user.id;
    const action = req.body.action;

    ViewsSchema.findOne({
        $and : [{productId : productId},{userId : userId}]  
    }).then(data=>{
           let changeTo = "";
        if(action == 'Like'){
            data.like = 1;
             changeTo = 'Liked'
        } 

        if(action == 'Liked'){
            data.like = 0;
             changeTo = 'Like'
        }

        data.save().then(data=>{
            console.log('updated is saved');
            res.status(200).send(changeTo);
        }).catch(err=>{
            console.log('error in like / unlike ',err);
            res.status(200).send('error in like / unlike');
        })

    }).catch(err=>{
        console.log('error in /like',err);
        res.status(200).send('error in /like');
    })

});

route.post('/users',ensureAuthentication,(req,res)=>{
    const productId = req.body.id;
    console.log(req.body.id);
    ViewsSchema.find({
        productId : productId
    }).then(datas => {
        const prepareViewUsers = fnprepareViewUsers(datas);
        res.status(200).send(prepareViewUsers);
    }).catch(err=> {
        console.log('error in /users');
        res.send(200).send('error in /users');
    })
});

route.post('/',ensureAuthentication,(req,res)=>{

    console.log('user body'+req.user);

    const firstName = req.user.firstName;
    const lastName = req.user.lastName;
    const image = req.user.image;
    const userId = req.user.id;
    const productId = req.body.productId;
    const productName = req.body.name;
    const action = req.body.action;

    //console.log(userId+' '+productId+' '+productName+' '+action);
    if(action === 'view'){
       console.log('inside view')
       ViewsSchema.findOne({
           $and : [{productId : productId},{userId : userId}]  
       }).then( (data) => {
           console.log('you find '+data);
           if(data==="" || data===null){
               console.log('data is '+data);
               new ViewsSchema({
                   userId : userId,
                   productId : productId,
                   email : req.user.email,
                   like : 0,
                   viewDate : new Date(),
                   lastName : lastName,
                   firstName : firstName,
                   avatar : image
               }).save().then(data=>{
                   console.log('data is saved');
                   res.sendStatus(200);
               }).catch(err=>{
                   console.log('error in saving view '+err);
                   res.sendStatus(200);
               })
           } else {
                console.log('already viewed!');
                const like = data['like'];
                console.log('here your like '+like);
                if(like > 0){
                    const msg = 'Liked';
                    res.status(200).send(msg);
                } else {
                    const msg = 'Like';
                    res.status(200).send(msg);
                }
                
           }
       }).catch(err=>{
           console.log('error in view ',err);
           res.sendStatus(200);
       })

    } else {

    }
});

module.exports = route;