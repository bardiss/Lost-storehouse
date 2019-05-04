const mongoose=require('mongoose');

//******* EMPLOYEE ******* */


 var EmployeeSchema = new mongoose.Schema({

    FirstName    : String,
    LastName      : String,
    UserName      : String,
    password      : String,
    Age           : Number,
    CardNumber    : Number,
    CVV           : Number,
    ExpirationMonth: Number,
    ExpirationYear: Number,
    JobDescription: String,
    Email         : String,
    PhoneNumber   : Number,
    Address       : String,
    Salary        : Number,
    Archive       : {
        type:Number,
        default:0
    }

 });

module.exports = mongoose.model("Employee", EmployeeSchema);