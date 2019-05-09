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
    }, 
    accepted: {type:Boolean,
        default: false
    },
    declined: {type:Boolean,
        default: false
    }
 }); 


module.exports = mongoose.model("Product" , productSchema) ;
 
