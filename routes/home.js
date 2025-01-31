const express = require('express'); //load the Express module.
const router = express.Router(); //to call express in this separate module.Here you work with a router object, instead of an app object. 

//Define a route. It is also a middleware function.
router.get('/', (req, res) =>{
    //res.send('Hello Monti!!!'); Replaced with the render method to use PUG and return a HTML markup to the client.
    res.render('index', { title: 'My Express App', message: 'Hello!'}); //you call the pug file and render its values dinamically. 
});

module.exports = router; 