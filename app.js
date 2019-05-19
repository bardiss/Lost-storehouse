
// Requiring used Libraries
const express   =require("express"),
bodyParser    =require("body-parser"),          // Please comment what this ???
methodOverride =require("method-override"),    // Please comment what this ???
mongoose      =require("mongoose"),
passport              = require("passport"),
LocalStrategy         = require("passport-local"),
passportLocalMongoose = require("passport-local-mongoose"),
config = require('config'), // config library to store configured data
//defDebugger = require('debug')('index:defDebugger'); // Setting up debugger

// Requiring used Routes
// Database Models
Admin           =require('./models/admin-model'),
Supplier      =require('./models/supplier-model'),
Employee      =require('./models/employee-model'),
Product         =require('./models/product-model'),
// Routes

adminRoute         =require('./routes/admin/admin-route'),
supplierRoute       =require('./routes/supplier/supplier-route'),
productRoute          =require('./routes/product/productMain'),


// Express middlewares
app           =express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.json()) ;           // enable json objects type to be used
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

// Jquery Setup
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);

// Authentication Work
app.use(require("express-session")({
    secret: "our team is great",  
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());



function SupplierFunc(req,res,next){
    passport.use('supplierLocal', new LocalStrategy(Supplier.authenticate()));
    passport.serializeUser(function(user, done) { 
    done(null, user);
    });

    passport.deserializeUser(function(user, done) {
    if(user!=null)
    done(null,user);
    });
    

    return next();
    
}


function AdminFunc(req, res, next){

    passport.use('adminLocal', new LocalStrategy(Admin.authenticate()));
    
    passport.serializeUser(function(user, done) { 
    done(null, user);
    });

    passport.deserializeUser(function(user, done) {
    if(user!=null)
    done(null,user);
    });
    
    /*
    passport.serializeUser(Admin.serializeUser());
    passport.deserializeUser(Admin.deserializeUser());
    */
    return next();
}
    



function EmployeeFunc(req,res,next){
    passport.use('employeeLocal', new LocalStrategy(Employee.authenticate()));
passport.serializeUser(Employee.serializeUser());
passport.deserializeUser(Employee.deserializeUser());
    return next();
}




// Connecting to DataBase Proceddure
const dbName = config.get("dbName")
mongoose.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }) 
.then(() =>console.log(`Connected to '${dbName}' DB successfully`)) // DB connected successfully
.catch((err) => console.log(`${dbName}' DB Connecting Error: ${err.message}`));  // Catch the error

// Redirecting to Routes
app.use("/admin",AdminFunc, adminRoute)
app.use("/suppliers",SupplierFunc,supplierRoute);
app.use("/products",EmployeeFunc,productRoute); 
 
app.get("/*", function(req, res){
    res.render("home");
})


const ip = config.get('ipName')
const port = config.get('portName')
app.listen(port,ip,function(){
    console.log(`server started on ${ip}:${port}`);
});


