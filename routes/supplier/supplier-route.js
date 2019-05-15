const express   =require("express"),
router          =express.Router()
const Product  =require('../../models/product-model'),
PullRequest = require('../../models/pullRequest')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')
//jquery setup
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);
// **************************************** Main Dashboard ****************************************
router.get("/",function(req,res){
    res.status(200)
        .render("SupplierDashboard");
});

//****************************************** Storing Products **************************************

router.post("/product/add",async (req,res) =>{
   const newProduct = req.body.product;
   newProduct.supplier = String(createId())    // supplier_id
   const validationResult = validateProduct(newProduct);
   if(!validationResult.error){
        try
        {
            await Product.create(newProduct);

            res.status(201)
                .render('requestSend');
        }
        catch(err)
        {
            // Printing the error
            console.log(err.message);
        }
   } 
   else
   {
       // Printing the error
        console.log(validationResult.error.details[0].message);
   } 
});

// ************************************* Pulling Orders *************************************************
// Adding a new Pull order

router.get("/products/pull", async function (req ,res){
    try
    {
        const result = await Product
            .find(
                {
                        // supplier_id
                    accepted: true,
                    declined: false,
                    confirmed: true
                }
            )     
            .select('name category quantity -_id');

        res.status(200)
            .render("PullProduct",{names: result});
    }
    catch(err){
        // Printing the error
        console.log(err.message);
    }
});

router.post("/products/pull",async function (req, res){
    const newPull = req.body.product;
    newPull.supplier = '5cd2ff1974edd329fcab2d69';        // supplier_id

    const validationResult = validatePull(newPull);
    if(!validationResult.error)
    {
        try
        {
            await PullRequest.create(newPull);
        
            res.status(201)
                .render('pulledSend');
        }
        catch(err)
        {
            // Printing the error
            console.log(err.message);
        }
    }
    else
    {
        // Printing the error
        console.log(validationResult.error.details[0].message);
    }
       
});

//***************************************** Showing Products already stored ****************************************

router.get("/products/show", async (req, res) => {
    try 
    {
        const storedProducts = await Product
            .find({
                    // supplier_id
                accepted: true,
                declined: false,
                confirmed: true})
            .select('-_id name category quantity');
      
        res.status(200)
            .render("supp_showproduct", {products: storedProducts});
    
    }
    catch(err)
    {
        // Printing the error
        console.log(err.message)
    }
    
});
//****************** DahsBoard declined requestes************************************************* */

router.get ("/suppdeclined", (req ,res) =>{
    res.status(200).render("supp_declinedrequest")

} )

// ********************************* showing accepted storing orders waiting to be confirmed ***********************

router.get("/storing/confirmations", async (req, res) => {
    try
    {
        const acceptedProducts = await Product
            .find({
                    // supplier_id
                accepted: true,
                declined: false, 
                confirmed: false})
            .select('_id name category quantity')

        res.status(200)
            .render("acceptedAdding",{products: acceptedProducts})
    }
    catch(err){
        // Printing the error
        console.log(err.message)
    }
});
// confirming or deciclining accepted adding orders
router.get("/storing/confirmations/:productId", async (req, res) => {
    try
    {
        const productUpdate = req.query
        const productID = req.params.productId

        await Product
            .updateOne({_id: productID}, productUpdate);
        
            res.status(201)
                .redirect('/suppliers/storing/confirmations')
    }
    catch(err){
        // Printing the error
        console.log(err.message)
    }
})

//*********************************  showing declined storing orders *************************************************

router.get("/storing/declined", async (req, res) => {
    try
    {
        const declindedProducts = await Product
            .find({
                    // supplier_id
                accepted: false,
                declined: true,
                confirmed: false
            })
            .select('-_id name category quantity')
        
            res.status(200)
                .render('supp_showdeclinedadding', {products: declindedProducts})
    }
    catch(err)
    {
        // Printing the error
        console.log(err.message)
    }
});


//************************************* showing declined Pullings orders *********************************************

router.get("/pulling/declined", async (req, res) => {
    try
    {
        const declindedPullings = await PullRequest
            .find({
                    // supplier_id 
                accepted: false,
                declined: true,
                confirmed: false})
            .select('-_id name category quantity');

        res.status(200)
            .render('supp_showdeclinedpulling', {products: declindedPullings});
    }
    catch(err)
    {
        // Printing the error
        console.log(err.message)
    }
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
        name: Joi.string().min(3).max(255).required(),
        category:Joi.string().required(),
        price: Joi.number(),
        quantity: Joi.number().integer().required(),
        supplier: Joi.objectId().required(),
        description: Joi.string()
    };
    return Joi.validate(product, schema);
}
// Validating Pulling according to it's schema
// Note: it shouldn't be here :)
function validatePull(pull){
    const schema = {
        name: Joi.string().min(3).max(255).required(),
        category:Joi.string().required(),
        quantity: Joi.number().integer().required(),
        supplier: Joi.objectId().required()
    };
    return Joi.validate(pull, schema) ;
}
/*
router.get("/accept/:id",async function(req,res){
    try
        {
        const addingRequest = await Product.findOne({_id: req.params.id})
        
        let founded = await Product.find({
            name: addingRequest.name,
            supplier: addingRequest.supplier,
           category: addingRequest.category,
            accepted: true,
            declined: false,
            confirmed: true
        })
        founded = founded[0]
        
        
        if(founded )
        {
            await Product.findByIdAndUpdate(founded._id, {$inc: {quantity:  parseInt(addingRequest.quantity)},
                                                                price: addingRequest.price,
                                                                description: addingRequest.description})
            await Product.deleteOne({_id: addingRequest._id })
        }

        else
        {
            await Product.findByIdAndUpdate(req.params.id, {accepted:true})
        }
        //res.redirect("/products");
        
        
    }
    catch(err)
    {
        console.log(err.message)
    }

});
*/
module.exports = router ;