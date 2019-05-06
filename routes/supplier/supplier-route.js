const express   =require("express"),
router          =express.Router(),
Supplier        =require('../../models/supplier-model'),
Employee        =require('../../models/employee-model'),
Product         =require('../../models/product-model')


router.get("/",function(req,res){
    res.render("SupplierDashboard")
});


router.get("/product/new",function(req ,res){
     res.render("NewProduct")
});


router.post("/product",function(req,res){
    Product.create(req.body.product,function(err,newProduct){

        if(err){
            console.log("can't add product post error");
        }

        else {
            console.log("added succesfully");
            
        }
    });
});



router.get("/pull",function(req ,res){
     res.render("PullProduct")
});



module.exports = router