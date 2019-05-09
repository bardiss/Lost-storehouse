const mongoose = require('mongoose');
//******* SUPPLIER ******* */
// Required ==> username(unique), email(unique), password
var SupplierSchema = new mongoose.Schema({
    UserName   : {
        type: String,
        minlength: 5,
        maxlength: 20,
        required: true,
        unique: true
      },
    Email      : {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    Password   : {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    FirstName  : {
        type: String,
        minlength: 5,
        maxlength: 20
      },
    LastName   : {
        type: String,
        minlength: 5,
        maxlength: 20
      },
    CardNumber : Number,
    CVV        : Number,
    ExpirationMonth: Number,
    ExpirationYear : Number,
    PhoneNumber: Number,
    Address    : String,
    Archive    : {
        type:Number,
        default:0
    }
 });

module.exports = mongoose.model("Supplier", SupplierSchema);

