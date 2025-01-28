//load de joi module, for input validation, it returns a class.
const Joi = require('joi');
const logger = require ('./logger');
const auth = require ('./auth');
//load the express module
const express = require('express');
const app = express(); //by default we store the result in a constant called app, to represent our application. 

app.use(express.json()); //to enable parsing of json objects in the body of a post request. 
app.use(express.urlencoded()); //parses encoming requests with url encoded payloads and populates them as a json object.

//call the middleware function from logger.js
app.use(logger);

//call the middleware function from auth.js
app.use(auth);

//Define the courses array
const courses = [
    { id : 1, name : 'course 1' },
    { id : 2, name : 'course 2' },
    { id : 3, name : 'course 3' },
];

//Define a route. It is also a middleware function.
app.get('/', (req, res) =>{
    res.send('Hello Monti!!!');
});

//Define a post request and its path, and create a new course object and push it on the array.
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

//To update a course, add a new route handler.1.Look up the course and if it doesn´t exist return 404. 
// Validate it or return 400 and if valid update it and return it. 
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');


    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

      course.name = req.body.name;
      res.send(course);
});

//1.look up the course, if it doesn´t exist return 404.Than delete it and return the same course. 
app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

//GET Request. To GET a specific course, use a route parameter and in this case we use id as the parameter. 
// And return a 404 error if the course is not find.
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');
    res.send(course); 
});

//Function to reuse validation.This is the new updated code for Joi v16.
// The validate() method is now used directly on the schema object, rather than being called as a static method on Joi.
function validateCourse(course) {
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
    });
  
    return schema.validate(course); 
  }

//Define another route
app.get('/api/courses', (req, res) => {
    res.send(courses); //here is where you can call a DB from your app.
});

//Add an environment variable, so you can listen to the port dinamically. On the terminal set PORT=5000 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log (`Listening on port ${port}...`));


