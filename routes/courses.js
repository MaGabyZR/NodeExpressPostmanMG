const express = require('express'); //load the Express module.
const router = express.Router(); //to call express in this separate module.Here you work with a router object, instead of an app object. 
const Joi = require('joi'); //load de joi module, for input validation, it returns a class.

//Define the courses array
const courses = [
    { id : 1, name : 'course 1' },
    { id : 2, name : 'course 2' },
    { id : 3, name : 'course 3' },
];

//Define a route
router.get('/', (req, res) => {
    res.send(courses); //here is where you can call a DB from your app.
});

//Define a post request and its path, and create a new course object and push it on the array.
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');


    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

      course.name = req.body.name;
      res.send(course);
});

//1.look up the course, if it doesn´t exist return 404.Than delete it and return the same course. 
router.delete('/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

//GET Request. To GET a specific course, use a route parameter and in this case we use id as the parameter. 
// And return a 404 error if the course is not find.
router.get('/:id', (req, res) => {
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

module.exports = router; 