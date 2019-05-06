const express   =require("express"),
router          =express.Router(),
Supplier        =require('../../models/supplier-model'),
Employee        =require('../../models/employee-model'),
Product         =require('../../models/product-model')

// ***************Main Dashboard*************
router.get("/",function(req,res){
    res.render("SupplierDashboard")
});




// ******************** Adding orders ******************
// Form page to add new product
router.get("/product/add",function(req ,res){
     res.render("NewProduct")
});

router.post("/product/add/", (req, res) => {
    req.send(req.body)
})

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