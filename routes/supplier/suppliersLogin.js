// Creating the Router
const express = require('express');
const suppLoginRouter = express.Router();

suppLoginRouter.get('/', (req, res) => {
    res.send('Logging screen')
    
});




// Exporting the Router
module.exports = suppLoginRouter ;