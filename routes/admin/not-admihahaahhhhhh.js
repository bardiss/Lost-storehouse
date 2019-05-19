const express   =require("express"),
router          =express.Router(),
Supplier        =require('../../models/supplier-model'),
Employee        =require('../../models/employee-model')



router.get("/",function(req,res){
    res.render("AdminDashboard")
});

router.get("/employee/new",function(req,res){
    res.render("RegisterEmployee");
});

router.get("/supplier/new",function(req,res){
    res.render("RegisterSupplier");
});


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

router.post("/supplier",function(req,res){
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


router.get("/admin_suppliers",function(req,res){
    Supplier.find({},function(err, suppliers){
        if(err){
            console.log("ERROR");
        } else {
                res.render("ManageSuppliers",{suppliers :suppliers});
 
        }
    });
 });
 
 router.get("/admin_employees",function(req,res){
    Employee.find({},function(err, employees){
        if(err){
            console.log("ERROR");
        } else {
                res.render("ManageEmployee",{employees :employees});
 
        }
    });
 });
 
 
 router.put("/admin_suppliers/:id",function(req,res){
    Supplier.findByIdAndUpdate(req.params.id , req.body.SupplierAccount , function(err,updatedSupplier){
        if(err){
            res.redirect("/admin");
        } else {
            res.redirect("/admin/admin_suppliers")
        }
    });
});


router.put("/admin_employees/:id",function(req,res){
    Employee.findByIdAndUpdate(req.params.id , req.body.EmployeeAccount , function(err,updatedEmployee){
        if(err){
            res.redirect("/admin");
        } else {
            res.redirect("/admin/admin_employees")
        }
    });
});

router.get("/admin_suppliers/:id/edit",function(req,res){
    Supplier.findById(req.params.id,function(err,foundSupplier){
        if (err) {
            res.redirect("/admin");
        } else {
                 res.render("EditSupplier",{Supplier:foundSupplier});

        }
    });
});
router.get("/admin_employees/:id/edit",function(req,res){
    Employee.findById(req.params.id,function(err,foundEmployee){
        if (err) {
            res.redirect("/admin");
        } else {
                 res.render("EditEmployee",{Employee:foundEmployee});

        }
    });
});


router.delete("/admin_suppliers/:id",function(req,res){
    
    Supplier.findByIdAndUpdate(req.params.id , {Archive:1} , function(err,updatedSupplier){
        if(err){
            res.redirect("/admin");
        } else {
            res.redirect("/admin/admin_suppliers")
        }
    });
});


router.delete("/admin_employees/:id",function(req,res){
    
    Employee.findByIdAndUpdate(req.params.id , {Archive:1} , function(err,updatedEmployee){
        if(err){
            res.redirect("/admin");
        } else {
            res.redirect("/admin/admin_employees")
        }
    });
});




module.exports = router