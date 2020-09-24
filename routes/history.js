const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
require('../modal/productsBought');
const ProductsBought = mongoose.model('productSchema');
const { ensureAuthentication } = require('../helpers/auth');

function putProductsInSingleArray(products){
    const productsForhandlebars = [];
    products.forEach(product => {
            for(let i = 0 ; i < product.productBought.length ; i ++){
                productsForhandlebars.push(JSON.parse(JSON.stringify(product.productBought[i])));
            }
     });

     return productsForhandlebars;
}   


route.get('/',ensureAuthentication,function(req,res){
    const userId = req.user.id;
    
    ProductsBought.find({
        userId : userId
    }).sort().then(products => {
        if(products){
           /* const productsBought = [];
            const product1 = {};
            products.forEach( product => {
                const product1 = {
                    items : product.productBought
                }
                productsBought.push(product1);
            });*/

            //console.log(products);

            const putProductsInSingle = putProductsInSingleArray(products);

            res.render('payment/productsBought',{
                products : putProductsInSingle
            });
        } else {
            res.render('payment/productsBought',{
                products : null
            });
        }
        
    });
});

module.exports = route;