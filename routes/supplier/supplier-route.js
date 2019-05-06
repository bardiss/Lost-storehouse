const express   =require("express"),
router          =express.Router(),
Supplier        =require('../../models/supplier-model'),
Employee        =require('../../models/employee-model')
const Product  =require('../../models/product-model')

// ***************Main Dashboard*************
router.get("/",function(req,res){
    res.render("SupplierDashboard")
});




// ******************** Adding orders ******************
// Form page to add new product
router.get("/product/add",function(req ,res){
     res.render("NewProduct").jsonp({success : true})
});


router.post("/product/add",async (req,res) => {
    const newProduct = req.body.product
    /*try{
        const result = await Product.create(newProduct)
        if (result){
            res.status(200).redirect('').
        }
    }
    catch(err) */
});



router.get("/pull",function(req ,res){
     res.render("PullProduct")
});



module.exports = router