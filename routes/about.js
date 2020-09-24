const express = require('express');
const route = express.Router();
//const { ensureAuthentication } = require('../helpers/auth');

route.get('/',(req,res)=>{
   res.render('footer_information/about');
});

module.exports = route;