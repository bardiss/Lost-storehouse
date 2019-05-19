const mongoose              = require('mongoose'),
      passportLocalMongoose = require("passport-local-mongoose");
      

//******* SUPPLIER ******* */

var SupplierSchema = new mongoose.Schema({

    FirstName  : String,
    LastName   : String,
    username   : String,
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
 
SupplierSchema.plugin(passportLocalMongoose);

module.exports  = mongoose.model("Supplier", SupplierSchema);

