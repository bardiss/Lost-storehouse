const express   =require("express"),
router          =express.Router(),
Supplier        =require('../../models/supplier-model'),
Employee        =require('../../models/employee-model')
const {Product, ValidateProduct}  =require('../../models/product-model')

// ***************Main Dashboard*************
router.get("/",function(req,res){
    res.render("SupplierDashboard")
});




// ******************** Adding orders ******************
// Form page to add new product
router.get("/product/add",function(req ,res){
     res.render("NewProduct")
});


router.post("/product/add",function(req,res){
    
});



router.get("/pull",function(req ,res){
     res.render("PullProduct")
});



module.exports = router