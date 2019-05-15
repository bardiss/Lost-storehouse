const express         =require("express"),
router                =express.Router(),
Supplier              =require('../../models/supplier-model'),
Employee              =require('../../models/employee-model'),
Admin                 = require('../../models/admin-model'),
passport              = require("passport"),
LocalStrategy         = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
bodyParser            = require('body-parser');


router.use(bodyParser.urlencoded({extended: true}));

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

passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());



router.get("/",isLoggedIn, function(req,res){
    res.render("AdminDashboard")         
});

router.get("/employee/new",isLoggedIn, function(req,res){
    Employee.find({},function(err,employees){
        if(err){
            console.log('err')
        }
        else{
               res.render("RegisterEmployee",{employees:employees});
 
        }
    })
});

router.get("/supplier/new",isLoggedIn, function(req,res){
    Supplier.find({},function(err,suppliers){
        if(err){
            console.log('err')
        }
        else{
               res.render("RegisterSupplier",{suppliers:suppliers});
 
        }
    })
});
//============ Admin Registration ==============

Admin.register({username: "mahmoud"}, "321" );
       


//============= supplier registration =============

router.post("/supplier",isLoggedIn,  function(req, res){
    console.log(req.body.username, req.body.password)
      //var newUser = new Supplier({username: req.body.username});
      //console.log(newUser)

    Supplier.register({username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            
        }else{
            console.log('account created')
            Supplier.findByIdAndUpdate(user._id,req.body.SupplierAccount,function(err,updatedSupplier){
                if(err){
                    console.log("error found do something")
                }
                else{
                    console.log("account has been fully created")
                    res.redirect("/admin/admin_suppliers")
                }
            })}
        });
    });
    
 
router.get("/hidden/login", function(req, res){
    
   res.render("login"); 
});    
    
router.post("/hidden", passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/admin/hidden/login"
}) ,function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/admin");  
}); 



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/admin/hidden/login");
}

    
//============== EMPLOYEE REGISTRATION =============    
/*
router.get("/register/new",function(req,res){
    res.render("register")
})
/*
router.post("/employee",  function(req, res){
console.log(req.body.username,req.body.password)
  
    Employee.register({username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);  
            
            return res.render('AdminDashboard');
        }
            console.log('account created')
            res.redirect("/admin/admin_employees")
            
        });
    });
    
  */  
    
router.post("/employee",isLoggedIn,  function(req, res){
    console.log(req.body.username, req.body.password)
      //var newUser = new Supplier({username: req.body.username});
      //console.log(newUser)

    Employee.register({username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);  
            
            return res.render('RegisterEmployee');
        }
            console.log('account created')
            Employee.findByIdAndUpdate(user._id,req.body.EmployeeAccount,function(err,updatedEmployee){
                if(err){
                    console.log("error found do something")
                }
                else{
                    console.log("account has been fully created")
                    res.redirect("/admin/admin_employees")
                }
            })
        });
    });
    
    

/*    
router.post("/employee",isLoggedIn,  function(req, res){
console.log(req.body.username,req.body.password)
  
    Employee.register({username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);  
            
            return res.render('AdminDashboard');
        }
            console.log('account created')
            Employee.findByIdAndUpdate(user._id,req.body.EmployeeAccount,function(err,updatedEmployee){
                if(err){
                    console.log("error found do something")
                }
                else{
                    console.log("account has been fully created")
                }
            })
        });
    });
    
    */
//======================================================    
    

router.get("/admin_suppliers",isLoggedIn, function(req,res){
    Supplier.find({},function(err, suppliers){
        if(err){
            console.log("ERROR");
        } else {
                res.render("ManageSuppliers",{suppliers :suppliers});
 
        }
    });
 });
 
 router.get("/admin_employees",isLoggedIn, function(req,res){
    Employee.find({},function(err, employees){
        if(err){
            console.log("ERROR");
        } else {
                res.render("ManageEmployee",{employees :employees});
 
        }
    });
 });
 
 
 router.put("/admin_suppliers/:id",isLoggedIn, function(req,res){
    Supplier.findByIdAndUpdate(req.params.id , req.body.SupplierAccount , function(err,updatedSupplier){
        if(err){
            res.redirect("/admin");
        } else {
            res.redirect("/admin/admin_suppliers")
        }
    });
});


router.put("/admin_employees/:id",isLoggedIn, function(req,res){
    Employee.findByIdAndUpdate(req.params.id , req.body.EmployeeAccount , function(err,updatedEmployee){
        if(err){
            res.redirect("/admin");
        } else {
            res.redirect("/admin/admin_employees")
        }
    });
});

router.get("/admin_suppliers/:id/edit",isLoggedIn, function(req,res){
    Supplier.findById(req.params.id,function(err,foundSupplier){
        if (err) {
            res.redirect("/admin");
        } else {
                 res.render("EditSupplier",{Supplier:foundSupplier});

        }
    });
});
router.get("/admin_employees/:id/edit",isLoggedIn, function(req,res){
    Employee.findById(req.params.id,function(err,foundEmployee){
        if (err) {
            res.redirect("/admin");
        } else {
                 res.render("EditEmployee",{Employee:foundEmployee});

        }
    });
});


router.delete("/admin_suppliers/:id",isLoggedIn, function(req,res){
    
    Supplier.findByIdAndUpdate(req.params.id , {Archive:1} , function(err,updatedSupplier){
        if(err){
            res.redirect("/admin");
        } else {
            res.redirect("/admin/admin_suppliers")
        }
    });
});


router.delete("/admin_employees/:id",isLoggedIn, function(req,res){
    
    Employee.findByIdAndUpdate(req.params.id , {Archive:1} , function(err,updatedEmployee){
        if(err){
            res.redirect("/admin");
        } else {
            res.redirect("/admin/admin_employees")
        }
    });
});

router.get('/*', function(req, res) {
    res.send("404 page not found don't come here again!!!! seriosuly i'm not joking don't hack us pleaseee");
    
});


/*
router.post("/employee",function(req,res){
    Employee.create(req.body.EmployeeAccount,function(err,newProduct){

        if(err){
            console.log("can't add product post error");
        }

        else {
            console.log("added succesfully");
            res.redirect("/admin/admin_employees");
        }
    });
});

/*
router.post("/supplier",function(req,res){
    console.log(req.body.username,req.body.password)
    Supplier.create(req.body.SupplierAccount,function(err,newProduct){

        if(err){
            console.log("can't add product post error");
        }

        else {
            console.log("added succesfully");
            res.redirect("/admin/admin_suppliers");
        }
    });
});
*/


module.exports = router