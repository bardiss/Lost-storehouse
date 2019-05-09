const express =require('express'),
router        =express.Router(),
Supplier        =require('../../models/supplier-model'),
Employee        =require('../../models/employee-model'),
Product        =require('../../models/product-model');

router.get("/",function(req,res){
    Product.find({},function(err,products){
        if(err){
            console.log('error');
        }
        else{
                res.render("workerDashboard",{products:products})

        }
    })
   // res.render("workerDashboard")
});

router.get("/addrequests",function(req,res){
    
    Product.find({},function(err, products){
        if(err){
            console.log("ERROR");
        } else {
                res.render("addrequests",{products :products});
 
        }
    });

   // res.render("addrequests")
 });

 router.get("/addrequests/:id",function(req,res){
    
    Product.findBYId(req.params.id,function(err, found_product){
        if(err){
            res.redirect("addrequests");
        } else {
                res.render("readMore",{found_product :found_product});
 
        }
    });

   // res.render("addrequests")
 });

module.exports = router