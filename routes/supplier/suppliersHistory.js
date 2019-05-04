// Creating the Router
const express = require('express');
const suppHistoryRouter = express.Router();

suppHistoryRouter.get('/:id', (req, res) => {
    res.send(`History of id: ${req.params.id}`)
    
});



// Exporting the Router
module.exports = suppHistoryRouter ;