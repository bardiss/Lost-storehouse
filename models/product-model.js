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
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    } 
 });



const Product = mongoose.model("Product" , productSchema) ;
module.exports.Product =  Product
