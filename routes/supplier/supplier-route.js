const express   =require("express"),
router          =express.Router(),
Supplier        =require('../../models/supplier-model'),
Employee        =require('../../models/employee-model'),
Product        =require('../../models/product-model');





router.get("/",function(req,res){
   Product.find({},function(err,products){
       if(err){
           console.log("ERROR");
       } else {
               res.render("index",{products :products});

       }
   });
});


router.get("/new",function(req,res){
    res.render("new");
});

router.post("/",function(req,res){
    Product.create(req.body.product,function(err,newProduct){

        if(err){
            console.log("can't add product post error");
        }

        else {
            console.log("added succesfully");
            res.redirect("/products");
        }
    });
});

router.get("/:id",function(req,res){
    Product.findById(req.params.id,function(err,foundProduct){
        if(err) {
            res.redirect("/products");
        } else {
                 res.render("show",{products:foundProduct});

        }
    });
});

router.get("/:id/edit",function(req,res){
    Product.findById(req.params.id,function(err,foundProduct){
        if (err) {
            res.redirect("/products");
        } else {
                 res.render("edit",{products:foundProduct});

        }
    });
});

router.put("/:id",function(req,res){
    Product.findByIdAndUpdate(req.params.id , req.body.product , function(err,updatedProduct){
        if(err){
            res.redirect("/products");
        } else {
            res.redirect("/products/"+req.params.id)
        }
    });
});

router.delete("/:id",function(req,res){
    Product.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/products");
        } else {
            res.redirect("/products");
        }
    });
});


module.exports = router;


