const mongoose = require('mongoose'),
passportLocalMongoose = require("passport-local-mongoose");
//******* SUPPLIER ******* */
// Required ==> username(unique), email(unique), password
var SupplierSchema = new mongoose.Schema({
    username   : {
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
    password   : {
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

 SupplierSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Supplier", SupplierSchema);
