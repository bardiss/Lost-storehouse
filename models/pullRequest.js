const mongoose = require('mongoose')

const pullReqSchema = new mongoose.Schema({

    name  : {
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
    quantity : {
        type: Number,
        required: true
    } ,
    date:{
        type:Date,
        default:Date.now
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        //required: true
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



module.exports = mongoose.model("PullRequest" , pullReqSchema) ;