//Middleware function for performing authentication and export it. 
// *If you don´t put next, it creates an endless loop.

function auth (req, res, next){
    console.log('Authenticating...');
    next();
}

module.exports = auth; 