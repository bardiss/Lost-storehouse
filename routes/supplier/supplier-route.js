const express   =require("express"),
router          =express.Router()
const Product  =require('../../models/product-model'),
PullRequest = require('../../models/pullRequest')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')
// **************************************** Main Dashboard ****************************************
router.get("/",function(req,res){
    res.render("SupplierDashboard")
});


//****************************************** Storing Products **************************************

// Adding new product
router.get("/product/add",function(req ,res){
    res.render("NewProduct")
});

router.post("/product/add",async (req,res) => {
   const newProduct = req.body.product
   
   if(!validateProduct(newProduct).error)
   {
        try{
            validateProduct(newProduct)
            const result = await Product.create(newProduct)
            if (result){
                res.status(200)
                .render('requestSend')
            }
        }
        catch(err){
            // do something
            res.send(err.message)
        }
   } 
   else{
       // do something
   }
   
});

// ************************************* Pulling Orders *************************************************
// Adding a new Pull order

router.get("/products/pull", async function (req ,res){
    const result = await Product.find().select('name category -_id') 

    res.render("PullProduct",{names: result})
});

router.post("/products/pull",async function (req, res){
    const newPull = req.body.product
    //newPull.supplier = `${createId()}  // Must be removed after authentication`
    newPull.supplier = '5cd2ff1974edd329fcab2d69'
    console.log(newPull.supplier)
    if(!validatePull(newPull).error)
    {
        try{
            const result = await PullRequest.create(newPull)
            if (result){
                res.status(200)
                .render('pulledSend')
            }
        }
        catch(err){
            // do something
            res.send(err.message)
        }
    }
    else{
        res.send(validatePull(newPull).error)
    }
    
   
});

//***************************************** Showing Products already stored ****************************************

router.get("/products/show", async (req, res) => {
    const storedProducts = await Product.find({supplier: "5cd03fd3e23a9038e0157957", accepted: true, confirmed: true})
    .select('-_id name category quantity')
    res.send(storedProducts)
});

// ********************************* showing accepted storing orders waiting to be confirmed ***********************

router.get("/storing/confirmations", async (req, res) => {
    const acceptedProducts = await Product.find({supplier: "5cd03fd3e23a9038e0157957", accepted: true, confirmed: false})
    .select('-_id name category quantity')
    res.send(acceptedProducts)
});


//*********************************  showing declined storing orders *************************************************

router.get("/storing/declined", async (req, res) => {
    const declindedProducts = await Product.find({supplier: "5cd03fd3e23a9038e0157957", declined: true})
    .select('-_id name category quantity')
    res.send(declindedProducts)
});
//******************************  showing accepted storing orders waiting to be confirmed ****************************

router.get("/pulling/confirmations", async (req, res) => {
    const acceptedPullings = await PullRequest.find({supplier: "5cd03fd3e23a9038e0157957", accepted: true, confirmed: false})
    .select('-_id name category quantity')
    res.send(acceptedPullings)
});


//************************************* showing declined storing orders *********************************************

router.get("/storing/declined", async (req, res) => {
    const declindedPullings = await Product.find({supplier: "5cd03fd3e23a9038e0157957", declined: true})
    .select('-_id name category quantity')
    res.send(declindedPullings)
});

// ******************** Data Validation Section ******************
// crreating new object id (instead supplier id which should be come from authentication)
// Note: this function should be deleted after commiting authentication
function createId(){
    return new mongoose.Types.ObjectId()
}

// Validating Product according to it's schema
// Note: it shouldn't be here :)
function validateProduct(product){
    const schema = {
        name: Joi.string().min(1).max(255).required(),
        category:Joi.string().required(),
        price: Joi.number(),
        quantity: Joi.number().integer().required(),
        supplier: Joi.objectId().required(),
        description: Joi.string()
    }
    return Joi.validate(product, schema)
}
// Validating Product according to it's schema
// Note: it shouldn't be here :)
function validatePull(pull){
    const schema = {
        name: Joi.string().min(1).max(255).required(),
        category:Joi.string().required(),
        quantity: Joi.number().integer().required(),
        supplier: Joi.objectId().required()
    }
    return Joi.validate(pull, schema)
}


module.exports = router 