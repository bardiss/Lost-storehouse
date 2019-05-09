const express   =require("express"),
router          =express.Router()
const Product  =require('../../models/product-model')
const PullRequest = require('../../models/pullRequest')

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
   try{
       const result = Product.create(newProduct)
       if (result){
           res.status(200)
           .render('requestSend')
       }
   }
   catch(err){
       res.send(err.message)
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
    try{
        const result = await PullRequest.create(newPull)
        if (result){
            res.status(200)
            .render('pulledSend')
        }
    }
    catch(err){
        res.send(err.message)
    }
    
});

//***************************************** Showing Products already stored ****************************************

router.get("/products/show", async (req, res) => {
    const storedProducts = await Product.find({supplier: "5cd03fd3e23a9038e0157957", accepted: true, confirmed: true})
    .select('-_id name category quantity')
    res.send(storedProducts)
})

// ********************************* showing accepted storing orders waiting to be confirmed ***********************

router.get("/storing/confirmations", async (req, res) => {
    const acceptedProducts = await Product.find({supplier: "5cd03fd3e23a9038e0157957", accepted: true, confirmed: false})
    .select('-_id name category quantity')
    res.send(acceptedProducts)
})


//*********************************  showing declined storing orders *************************************************

router.get("/storing/declined", async (req, res) => {
    const declindedProducts = await Product.find({supplier: "5cd03fd3e23a9038e0157957", declined: true})
    .select('-_id name category quantity')
    res.send(declindedProducts)
})





//******************************  showing accepted storing orders waiting to be confirmed ****************************

router.get("/pulling/confirmations", async (req, res) => {
    const acceptedPullings = await PullRequest.find({supplier: "5cd03fd3e23a9038e0157957", accepted: true, confirmed: false})
    .select('-_id name category quantity')
    res.send(acceptedPullings)
})


//************************************* showing declined storing orders *********************************************

router.get("/storing/declined", async (req, res) => {
    const declindedPullings = await Product.find({supplier: "5cd03fd3e23a9038e0157957", declined: true})
    .select('-_id name category quantity')
    res.send(declindedPullings)
})





module.exports = router