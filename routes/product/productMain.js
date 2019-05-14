const express =require('express'),
router        =express.Router(),
Supplier        =require('../../models/supplier-model'),
Employee        =require('../../models/employee-model'),
Product         =require('../../models/product-model'),
PullRequest     = require('../../models/pullRequest');
const mongoose = require('mongoose')


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
    
    PullRequest.find({},function(err, products){
        if(err){
            console.log("ERROR");
        } else {
                res.render("pullrequests",{products :products});
 
        }
    });

   // res.render("addrequests")
 });

/*
 router.get('/addrequests/readMore',function(req,res){
    Product.find({},function(err, found_product){
        if(err){
            console.log("ERROR");
        } else {
                res.render("readMore",{found_product :found_product});
 
        }
    });
 });
*/

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

router.get("/pullrequests/:id",function(req,res){
     
    PullRequest.findById(req.params.id , function(err , found_product){
        if(err){
            res.redirect("/products/addrequests");
        } else {
                res.render("showMore",{found_product :found_product});
 
        }
    });

   // res.send("addrequests")
 });


 router.put("/pullrequests/:id",function(req,res){
    PullRequest.findByIdAndUpdate(req.params.id , function(err,updatedProduct){
        if(err){
            res.redirect("/products/addrequests");
        } else {
            res.render("showMore",{found_product :updatedProduct});
        }
    });
});

/*
router.put("/accept/:id",async function(req,res){
    try{
        const addingRequest = await Product.findById(req.params.id)
        const founded = await Product.find({name: addingRequest.name, 
            supplier: addingRequest.supplier,
             category: addingRequest.category,
            accepted: true,
            declined: false,
            confirmed: true})
        console.log(founded)
        
        if(founded)
        {
            await Product.findByIdAndUpdate(founded._id, {$inc: {quantity:  parseInt(addingRequest.quantity)},
                                                                price: addingRequest.price,
                                                                description: addingRequest.description})
            await Product.deleteOne({_id: addingRequest._id })
        }

        else
        {
            await Product.findByIdAndUpdate(req.params.id, {accepted:true})
        }
        res.redirect("/products");
        
    }
    catch(err)
    {
        console.log(err.message)
    }

});
*/




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


router.put("/declinePull/:id",function(req,res){
    PullRequest.findByIdAndUpdate(req.params.id, {declined:true} ,function(err,products){
        if(err){
            console.log(err)
        }else{
            res.redirect("/products/pullrequests");
            // res.render("addrequests",{products :products});
        }
    });

});



/*
router.put('/acceptpull/:id',function(req, res) {
    let founded = PullRequest.findByIdAndUpdate(req.params.id, {accepted:true} ,function(err,products){

    Product.create(
        {
            accepted: true,
            declined: founded.declined,
            confirmed: founded.confirmed,
            category: founded.category,
            name: founded.name,
            quantity: founded.quantity,
            supplier: founded.supplier,
            date: founded.date
        }
    )
    if(err){
        console.log(err)
    }else{
        res.redirect("/products/pullrequests");
      // res.render("addrequests",{products :products});
    }
})
});
*/

router.put('/acceptpull/:id',async function (req, res) {

    try{
    let foundedPull = await PullRequest.findByIdAndUpdate( req.params.id, {accepted: true})
    
    await Product.updateOne({name: foundedPull.name, supplier: foundedPull.supplier}
        , {$inc: {quantity: - parseInt(foundedPull.quantity)}})

    res.redirect("/products/pullrequests");
    }
    catch(err)
    {
        console.log(err)
    }

    

});



module.exports = router