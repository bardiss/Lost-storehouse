const express   =require("express"),
router          =express.Router()
const Product  =require('../../models/product-model'),
PullRequest = require('../../models/pullRequest'),
passport              = require("passport"),
LocalStrategy         = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
Supplier = require('../../models/supplier-model'),
bodyParser            = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
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


router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
 });
 
 router.use(require("express-session")({
     secret: "our team is great",  
     resave: false,
     saveUninitialized: false
 }));
 router.use(passport.initialize());
 router.use(passport.session());
 
 passport.use('supplierLocal',new LocalStrategy(Supplier.authenticate()));
 
 passport.serializeUser(function(user, done) { 
    done(null, user);
    });

    passport.deserializeUser(function(user, done) {
    if(user!=null)
    done(null,user);
    });

 
router.get("/login", function(req, res){
    
    res.render("supplogin"); 
 });    
     
 router.post("/login", passport.authenticate("supplierLocal", {
     successRedirect: "/suppliers",
     failureRedirect: "/suppliers/login"
 }) ,function(req, res){
 });
 
 router.get("/logout", function(req, res){
     req.logout();
     res.redirect("/suppliers");  
 }); 
 
 
 
 
 function isLogged(req, res, next){
     if(req.user.role==="Admin"){
         res.send('you are already logged in as admin logout to login as another account')
     }
     else if (req.user.role==="Employee") {
        res.send('you are already logged in as supplier logout to login as another account')

     }
     
     else {
          
            if(req.isAuthenticated()&& req.user.role==="Supplier" && req.user.Archive!==1 ){
                return next();
                }
     
            res.redirect("/suppliers/login");
         }
   
    }
 
router.get("/",isLogged, function(req,res){
    res.status(200)
        .render("SupplierDashboard");
});

//****************************************** Storing Products **************************************

router.post("/product/add", isLogged,async (req,res) =>{
   const newProduct = req.body.product;
   newProduct.supplier = req.user._id
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

router.get("/products/pull", isLogged, async function (req ,res){
    try
    {
        const result = await Product
            .find(
                {
                    supplier: req.user._id,
                    accepted: true,
                    declined: false,
                    confirmed: true
                }
            )     
            .select('name category quantity -_id');

        res.status(200)
            .render("PullProduct",{names: result});
    }
    catch(err)
    {
        // Printing the error
        console.log(err.message);
    }
});

router.post("/products/pull", isLogged,async function (req, res){
    const newPull = req.body.product;
    newPull.supplier = req.user._id

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

router.get("/products/show", isLogged, async (req, res) => {
    try 
    {
        const storedProducts = await Product
            .find({
                supplier: req.user._id,
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


// ********************************* showing accepted storing orders waiting to be confirmed ***********************

router.get("/storing/confirmations", isLogged, async (req, res) => {
    try
    {
        const acceptedProducts = await Product
            .find({
                supplier: req.user._id,
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
router.get("/storing/confirmations/:productId", isLogged, async (req, res) => {
    try
    {
        // First, check if the product is confirmed
        const confirmed = req.query.confirmed
        if(confirmed)
        {
            // Yes?, so search for a such product in the database
            const productID = req.params.productId
            const addingRequest = await Product.findOne({_id: productID})
            
            let founded = await Product.find({
                name: addingRequest.name,
                supplier: addingRequest.supplier,
            category: addingRequest.category,
                accepted: true,
                declined: false,
                confirmed: true
            })
            founded = founded[0]
            
            // Have you find such product in the databas?
            if(founded )
            {
                // if yes, so update it and remove the new request
                await Product.findByIdAndUpdate(founded._id, {$inc: {quantity:  parseInt(addingRequest.quantity)},
                                                                    price: addingRequest.price,
                                                                    description: addingRequest.description})
                await Product.deleteOne({_id: addingRequest._id })
            }
                // if not dound , so accept the new product by changing the confirmed to true
            else
            {
                await Product.findByIdAndUpdate(productID, {confirmed:true})
            }
        }


        // if the product is declined, so simply refuse it
        else{
            await Product.updateOne({_id: productID}, {confirmed: false, declined: true, accepted: false})
        }

        res.status(201)
                .redirect('/suppliers/storing/confirmations')
    }
    catch(err){
        // Printing the error
        console.log(err.message)
    }
})

//*********************************  showing declined storing orders *************************************************

router.get("/storing/declined", isLogged, async (req, res) => {
    try
    {
        const declindedProducts = await Product
            .find({
                supplier: req.user._id,
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

router.get("/pulling/declined", isLogged, async (req, res) => {
    try
    {
        const declindedPullings = await PullRequest
            .find({
                supplier: req.user._id, 
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

router.get('/*', function(req, res) {
    res.send("404 page not found don't come here again!!!! seriosuly i'm not joking don't hack us pleaseee");
    
});



// ******************** Data Validation Section ******************
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

module.exports = router ;