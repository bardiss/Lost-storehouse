const mongoose = require('mongoose');
const Joi = require('joi');
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

function ValidateUser(user) {
    const schema = {
      UserName: Joi.string().min(5).max(20).required(),
      Email: Joi.string().min(5).max(255).required().email(),
      Password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(user, schema);
}

const Supplier = mongoose.model("Supplier", SupplierSchema);
exports.Supplier  = Supplier
exports.ValidateUser = ValidateUser 

