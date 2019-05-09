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


router.get("/addrequests", function(req,res){
 
    Product.find({},function(err, products){
        if(err){
            console.log("ERROR");
        } else {
                res.render("addrequests",{products :products});
 
        }
    });

   // res.render("addrequests") 5cd2ff1974edd329fcab2d69
 });

    /*
   // const result = await Product.find({})
   try{const result = await Product.find({supplier: "5cd2ff1974edd329fcab2d69"}).populate('supplier', 'UserName -_id').select('-_id supplier')
    console.log(result)
    res.render('addrequests', {products: result})
}
    catch(err){
        console.log(err.message)
    }*/
   


 router.get("/pullrequests",function(req,res){
    
    Product.find({},function(err, products){
        if(err){
            console.log("ERROR");
        } else {
                res.render("pullrequests",{products :products});
 
        }
    });

   // res.render("addrequests")
 });


 router.get('/addrequests/readMore',function(req,res){
    Product.find({},function(err, found_product){
        if(err){
            console.log("ERROR");
        } else {
                res.render("readMore",{found_product :found_product});
 
        }
    });
 });


 router.get("/addrequests/:id",function(req,res){
     
    Product.findById(req.params.id , function(err , found_product){
        if(err){
            res.redirect("/products/addrequests");
        } else {
                res.render("readMore",{found_product :found_product});
 
        }
    });

   // res.send("addrequests")
 });


 router.put("/addrequests/:id",function(req,res){
    Product.findByIdAndUpdate(req.params.id , function(err,updatedProduct){
        if(err){
            res.redirect("/products/addrequests");
        } else {
            res.render("readMore",{found_product :updatedProduct});
        }
    });
});

router.put("/accept/:id",function(req,res){
    Product.findByIdAndUpdate(req.params.id, {accepted:true} ,function(err,products){
        if(err){
            console.log(err)
        }else{
            res.redirect("/products");
            // res.render("addrequests",{products :products});
        }
    });

});

router.put("/decline/:id",function(req,res){
    Product.findByIdAndUpdate(req.params.id, {declined:true} ,function(err,products){
        if(err){
            console.log(err)
        }else{
            res.redirect("/products");
            // res.render("addrequests",{products :products});
        }
    });

});



router.get('/test', (req, res) => {
    Product.create({
        name: 'laptop',
        price: 20000,
        supplier: "5cd2ff1974edd329fcab2d69",
        accepted: false
    })
    res.send('Created ya esraa')
})


module.exports = router