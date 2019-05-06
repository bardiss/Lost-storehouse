const mongoose=require('mongoose');
const Joi = require('joi')
//******* PRODUCT ******* */

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        reuqired: true,
        minlength: 1,
        maxlength: 255
    },
    category : {
        type:String ,
        required: true,
        enum: ['Laptop', 'TV', 'Smartphones']

    },
    price : Number ,
    quantity : {
        type: Number,
        required: true
    } ,
    description:String,
    date:{
        type: Date,
        default: Date.now
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
    },
    confirmed: {
        type: Boolean,
        default: false
    }
 });

 function ValidateProduct(user) {
    const schema = {
      name: Joi.string().min(1).max(255).required(),
      category: Joi.string().required(),
      quantity: Joi.number().integer()
    };
    return Joi.validate(user, schema);
}


const Product = mongoose.model("Product" , productSchema) ;
exports.Product =  Product
exports.ValidateProduct = ValidateProduct
