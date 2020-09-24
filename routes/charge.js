const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const { ensureAuthentication } = require('../helpers/auth')
require('../modal/productsBought')
const ProductsBought = mongoose.model('productSchema')


function saveBoughtProducts (userId,email,products,price,image,boughtDate) {
    const productsBought  = new ProductsBought({
        userId :userId,
        email : email,
        productBought : products,
        price : price,
        image :image,
        boughtDate : boughtDate
    });

    productsBought.save().then(function(products){
        console.log('Products saved successfully');
    }).catch(err=>console.log('error '+err));
    
}

//loading strip
/*old code working for stipe
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}*/
const keys = require('../config/keys');
const stripePublicKey = keys.stripePublicKey;
const stripeSecretKey = keys.stripeSecretKey;
//console.log('stripePublicKey' + stripePublicKey);
//console.log('stripeSecretKey' + stripeSecretKey);
const stripe = require('stripe')(stripeSecretKey);
/*
route.get('/',ensureAuthentication,function(req,res){
    console.log('hi my name is ajay');
    res.send("You cannot access");
});
*/
route.post('/',ensureAuthentication,function(req,res){
   // console.log("reqyest user " + req.user);
   // console.log(req.body);
    fs.readFile('./products.json','utf8',function(err,data){
       if(err){
           console.log('error ',Error);
           res.status(500).send();
       } else {
           const backItems = JSON.parse(data);
          // console.log('back ',backItems);
           const frontItems = JSON.parse(req.body.productsList);
         //  console.log('front',frontItems);
         //  console.log('token '+req.body.stripeToken);
           const boughtProducts = [];
           

           for(let i=0 ; i < backItems.length; i++){
               for(let j=0 ; j < frontItems.length; j++){
                   if(backItems[i].id == frontItems[j].id){
                      const b = backItems[i];
                      b['itemQuantity'] = frontItems[j].itemQuantity;
                      boughtProducts.push(b);
                   }
               }
           }

           //console.log('bought products ',boughtProducts);

           const amount = boughtProducts.reduce((total,currentValue,indexValue,boughtProducts)=>{
               return total + parseInt(currentValue.itemQuantity)*currentValue.price/100;
           },0);

           //console.log('amoutn is in rupe ',amount);

           const totalAmount = amount;

          //console.log(totalAmount);

            stripe.customers.create({
            email : req.body.stripeEmail,
            source : req.body.stripeToken
            }).then(customer=>{
                 stripe.charges.create({
                    amount : totalAmount*100,
                    customer : customer.id,
                    currency : 'inr',
                    description : 'Product store'
                }).then(function(){
                    console.log('success payment ');
                    const userId = req.user.id;
                    const email = req.user.email;
                    const products = JSON.parse(req.body.productsList);
                    const amount = totalAmount;
                    const image = 'path';
                    const boughtDate = new Date();
                    //const r = saveBoughtProducts('13434','ajram3003@gmail.com','ajay,chauhgn','22','imagepath')
                    saveBoughtProducts(userId,email,products,amount,image,boughtDate);
                    res.render('payment/success',{
                        productBought : products,
                        price : amount,
                        image :image,
                        boughtDate : boughtDate
                    });
                }).catch(function(err){
                    console.log('error is ',err);
                    console.log('error in payment');
                    res.render('payment/failure');
                });
            }).catch(err => {
                console.log('error in creating the customer ',err);
                res.status(500).end();
            })


       }
    });
    
});

module.exports = route;