const startupDebugger = require('debug') ('app:startup'); //load the debug package from Node.
const dbDebugger = require('debug') ('app:debug'); //Debugger for databases.
const config = require('config');//load the config module.
const helmet = require('helmet');//load helmet.
const morgan = require('morgan');//load morgan
const Joi = require('joi');//load de joi module, for input validation, it returns a class.
const logger = require ('./middleware/logger');
const courses = require('./routes/courses');//load the courses module. 
const home = require('./routes/home');
const auth = require ('./auth');
const express = require('express');//load the express module
const app = express(); //by default we store the result in a constant called app, to represent our application. 

//set the PUG templating engine. 
app.set('view engine', 'pug'); //Express can load it automatically.
app.set('views', './views'); // it is the default folder where all our templates are stored.

app.use(express.json()); //to enable parsing of json objects in the body of a post request. 
app.use(express.urlencoded({ extended: true })); //parses encoming requests with url encoded payloads and populates them as a json object.
app.use(express.static('public')); //to serve static content, like css files, images, etc.
app.use(helmet());
app.use('/api/courses', courses); //to use the courses module, and remove all /api/courses route in courses.js
app.use('/', home); //to use the home router for any path that starts with /

//Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
//console.log('Mail Password: ' + config.get('mail.password'));

//to test in what environment you are working. 
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
}

//if you work with a DB, for example.
dbDebugger('Connected to the database...')

//call the middleware function from logger.js
app.use(logger);

//call the middleware function from auth.js
app.use(auth);

//Add an environment variable, so you can listen to the port dinamically. On the terminal set PORT=5000 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log (`Listening on port ${port}...`));


