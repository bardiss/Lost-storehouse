const express   =require("express"),
router          =express.Router()
const Product  =require('../../models/product-model'),
PullRequest = require('../../models/pullRequest')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')
// **************************************** Main Dashboard ****************************************
router.get("/",function(req,res){
    res.status(200)
        .render("SupplierDashboard");
});


//****************************************** Storing Products **************************************

// Adding new product
router.get("/product/add",function(req ,res){
    res.status(200)
        .render("NewProduct");
});

router.post("/product/add",async (req,res) =>{
   const newProduct = req.body.product;
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
            .find()     
            .select('name category -_id');

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
    //newPull.supplier = `${createId()}  // Must be removed after authentication`
    newPull.supplier = '5cd2ff1974edd329fcab2d69';

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
                //supplier: "5cd03fd3e23a9038e0157957" ,
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
//****************** DahsBoard accepted requestes************************************************* */

router.get ("/suppaccepted", (req ,res) =>{
    res.status(200).render("supp_acceptedrequest")

} )

// ********************************* showing accepted storing orders waiting to be confirmed ***********************

router.get("/storing/confirmations", async (req, res) => {
    try
    {
        const acceptedProducts = await Product
            .find({
                //supplier: "5cd03fd3e23a9038e0157957",
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
                //supplier: "5cd03fd3e23a9038e0157957",
                accepted: false,
                declined: true,
                confirmed: false
            })
            .select('-_id name category quantity')
        
            res.status(200)
                .send(declindedProducts)
    }
    catch(err)
    {
        // Printing the error
        console.log(err.message)
    }
});
//******************************  showing accepted Pullings orders waiting to be confirmed ****************************

router.get("/pulling/confirmations", async (req, res) => {
    try
    {
        const acceptedPullings = await PullRequest
            .find({
                //supplier: "5cd03fd3e23a9038e0157957",
                accepted: true,
                declined: false, 
                confirmed: false})
            .select('_id name category quantity') ;

        res.status(200)
            .send(acceptedPullings);
    }
    catch(err)
    {
        // Printing the error
        console.log(err.message)
    }

});

// confirming or deciclining accepted pulling orders
router.get("/pulling/confirmations/:pullingId", async (req, res) => {
    try
    {
        const pullingUpdate = req.query
        const pullingID = req.params.pullingID

        await PullRequest
            .updateOne({_id: pullingID}, pullingUpdate);
        
            res.status(201)
                .redirect('/suppliers/pulling/confirmations')
    }
    catch(err){
        // Printing the error
        console.log(err.message)
    }
})


//************************************* showing declined Pullings orders *********************************************

router.get("/pulling/declined", async (req, res) => {
    try
    {
        const declindedPullings = await Product
            .find({
                //supplier: "5cd03fd3e23a9038e0157957", 
                accepted: false,
                declined: true,
                confirmed: false})
            .select('-_id name category quantity');

        res.send(declindedPullings);
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
        name: Joi.string().min(1).max(255).required(),
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
        name: Joi.string().min(1).max(255).required(),
        category:Joi.string().required(),
        quantity: Joi.number().integer().required(),
        supplier: Joi.objectId().required()
    };
    return Joi.validate(pull, schema) ;
}



module.exports = router ;