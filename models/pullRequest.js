const mongoose = require('mongoose')

const pullReqSchema = new mongoose.Schema({

    name  : {String ,

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
        type:Date,
        default:Date.now
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    }
 });



const PullRequest = mongoose.model("PullRequest" , pullReqSchema) ;




module.exports.PullRequest = PullRequest