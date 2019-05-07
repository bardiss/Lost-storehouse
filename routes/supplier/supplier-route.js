const express   =require("express"),
router          =express.Router()
const Product  =require('../../models/product-model')
const {PullRequest} = require('../../models/pullRequest')

// ***************Main Dashboard*************
router.get("/",function(req,res){
    res.render("SupplierDashboard")
});




// ******************** Adding orders ******************
// Form page to add new product
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

// Pulling Products



router.get("/products/pull", async function (req ,res){
    const result = await Product.find({category: 'Laptop'}).select('name category -_id') 
        
    res.render("PullProduct",{names: result})
});

router.post("/products/pull",async function (req, res){
    const newPull = req.body.product
    try{
        const result = await PullRequest.create(newPull)
        if (result){
            res.status(200)
            .render('requestSend')
        }
    }
    catch(err){
        res.send(err.message)
    }
    
});


module.exports = router