// Creating the Router
const express = require('express');
const suppWithdrawRouter = express.Router();

suppWithdrawRouter.get('/:id', (req, res) => {
    res.send(`with Drawing id: ${req.params.id}`)
    
});




// Exporting the Router
module.exports = suppWithdrawRouter ;