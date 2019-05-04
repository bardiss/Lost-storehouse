// Creating the Router
const express = require('express');
const suppDepositsRouter = express.Router();

suppDepositsRouter.get('/:id', (req, res) => {
    res.send(`Depositing id: ${req.params.id}`)
});


// Exporting the Router
module.exports = suppDepositsRouter ;