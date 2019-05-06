// Creating the Router
const express = require('express');
const suppMainRouter = express.Router();

// Requiring Models
const {Supplier, ValidateUser} = require('../../models/supplier-model')
const {Product} = require('../../models/product-model')


/*suppMainRouter.get('/:id', (req, res) => {
    // send Name, logo, Debt
    // Optional( Send count of orders)
    // send Pending Feedbacks
    res.send(`getting id: ${req.params.id}`)
    
});

suppMainRouter.put('/:id', (req, res) => {
    // update certain feedBack
    // reload page  // hide feedback
    res.send(`updating id: ${req.params.id}`)
    
});
*/
const suppliersLogin = require('./suppliersLogin')
suppMainRouter.use('/', suppliersLogin)

const suppliersWithDraw = require('./suppliersWithdraws')
suppMainRouter.use('/withdraws', suppliersWithDraw)

const suppliersDeposits = require('./suppliersDeposits')
suppMainRouter.use('/deposits', suppliersDeposits)

const suppliersHistory = require('./suppliersHistory')
suppMainRouter.use('/history', suppliersHistory)



// Exporting the Router
module.exports = suppMainRouter ;