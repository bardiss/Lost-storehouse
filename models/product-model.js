const mongoose=require('mongoose');

//******* PRODUCT ******* */

var productSchema = new mongoose.Schema({

    name  : String ,
    category : String ,
    price : Number ,
    quantity : Number ,
    description:String,
    date:{
        type:Date,
        default:Date.now
    }
 });

 module.exports = mongoose.model("product" , productSchema) ; 
