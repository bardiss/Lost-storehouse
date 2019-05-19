const mongoose=require('mongoose'),
      passportLocalMongoose = require("passport-local-mongoose");    

//******* EMPLOYEE ******* */


 var EmployeeSchema = new mongoose.Schema({

    FirstName    : String,
    LastName      : String,
    username      : String,
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
    },
    role    :{
        type:String,
        default:"Employee"
    }

 });
 
EmployeeSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Employee", EmployeeSchema);