
//Create a custom middleware funtion, to pass control to the next middleware function and export it.
// *If you don´t put next, it creates an endless loop.
function log (req, res, next){
    console.log('Logging...');
    next();
}

module.exports = log; 