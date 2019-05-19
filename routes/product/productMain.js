const express =require('express'),
router        =express.Router(),
Supplier        =require('../../models/supplier-model'),
Employee        =require('../../models/employee-model'),
Product         =require('../../models/product-model'),
PullRequest     = require('../../models/pullRequest'),
passport              = require("passport"),
LocalStrategy         = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
mongoose = require('mongoose')


router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
 });
 
 router.use(require("express-session")({
     secret: "our team is great",  
     resave: false,
     saveUninitialized: false
 }));
 router.use(passport.initialize());
 router.use(passport.session());
 
 passport.use('employeeLocal',new LocalStrategy(Employee.authenticate()));
 passport.serializeUser(function(user, done) { 
    done(null, user);
    });

    passport.deserializeUser(function(user, done) {
    if(user!=null)
    done(null,user);
    });
 
 
 /*
 passport.serializeUser(Employee.serializeUser());
 passport.deserializeUser(Employee.deserializeUser());
*/
 
router.get("/login", function(req, res){
    
    res.render("emplogin"); 
 });    
     
 router.post("/login", passport.authenticate("employeeLocal", {
     successRedirect: "/products",
     failureRedirect: "/products/login"
 }) ,function(req, res){
 });
 
 router.get("/logout", function(req, res){
     req.logout();
     res.redirect("/products");  
 }); 
 
 
 
 function isLogged(req, res, next){
     if(req.user.role==="Admin"){
         res.send('you are already logged in as admin logout to login as another account')
     }
     else if (req.user.role==="Supplier") {
        res.send('you are already logged in as supplier logout to login as another account')

     }
     
     else {
          
            if(req.isAuthenticated()&& req.user.role==="Employee" && req.user.Archive!==1 ){
                return next();
                }
     
            res.redirect("/products/login");
         }
   
    }
 


router.get("/",isLogged,function(req,res){
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


router.get("/addrequests",isLogged, function(req,res){
 
    Product.find({},function(err, products){
        if(err){
            console.log("ERROR");
        } else {
                res.render("addrequests",{products :products});
 
        }
    });

  
 });

  


 router.get("/pullrequests",isLogged,function(req,res){
    
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

 router.get("/addrequests/:id",isLogged,function(req,res){
     
    Product.findById(req.params.id , function(err , found_product){
        if(err){
            res.redirect("/products/addrequests");
        } else {
                res.render("readMore",{found_product :found_product});
 
        }
    });

   // res.send("addrequests")
 });


 router.put("/addrequests/:id",isLogged,function(req,res){
    Product.findByIdAndUpdate(req.params.id , function(err,updatedProduct){
        if(err){
            res.redirect("/products/addrequests");
        } else {
            res.render("readMore",{found_product :updatedProduct});
        }
    });
});

router.get("/pullrequests/:id",isLogged,function(req,res){
     
    PullRequest.findById(req.params.id , function(err , found_product){
        if(err){
            res.redirect("/products/addrequests");
        } else {
                res.render("showMore",{found_product :found_product});
 
        }
    });

   // res.send("addrequests")
 });


 router.put("/pullrequests/:id",isLogged,function(req,res){
    PullRequest.findByIdAndUpdate(req.params.id , function(err,updatedProduct){
        if(err){
            res.redirect("/products/addrequests");
        } else {
            res.render("showMore",{found_product :updatedProduct});
        }
    });
});



router.put("/accept/:id",isLogged,function(req,res){
    
    Product.findByIdAndUpdate(req.params.id, {accepted:true} ,function(err,products){
        if(err){
            console.log(err)
        }else{
            res.redirect("/products");
            // res.render("addrequests",{products :products});
        }
    });

});

router.put("/decline/:id",isLogged,function(req,res){
    Product.findByIdAndUpdate(req.params.id, {declined:true} ,function(err,products){
        if(err){
            console.log(err)
        }else{
            res.redirect("/products");
            // res.render("addrequests",{products :products});
        }
    });

});


router.put("/declinePull/:id",isLogged,function(req,res){
    PullRequest.findByIdAndUpdate(req.params.id, {declined:true} ,function(err,products){
        if(err){
            console.log(err)
        }else{
            res.redirect("/products/pullrequests");
            // res.render("addrequests",{products :products});
        }
    });

});




router.put('/acceptpull/:id',isLogged,async function (req, res) {

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