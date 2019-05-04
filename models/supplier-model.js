const mongoose = require('mongoose');

//******* SUPPLIER ******* */

var SupplierSchema = new mongoose.Schema({

    FirstName  : String,
    LastName   : String,
    UserName   : String,
    password   : String,
    CardNumber : Number,
    CVV        : Number,
    ExpirationMonth: Number,
    ExpirationYear : Number,
    Email      : String,
    PhoneNumber: Number,
    Address    : String,
    Archive    : {
        type:Number,
        default:0
    }
    

 });

module.exports  = mongoose.model("Supplier", SupplierSchema);

