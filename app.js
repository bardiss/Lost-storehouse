
// Requiring used Libraries
const express   =require("express"),
bodyParser    =require("body-parser"),          // Please comment what this ???
methodOverride =require("method-override"),    // Please comment what this ???
mongoose      =require("mongoose"),
config = require('config'), // config library to store configured data
Joi = require('joi'),       // joi library used to validate data
//defDebugger = require('debug')('index:defDebugger'); // Setting up debugger

// Requiring used Routes
// Database Models
Supplier      =require('./models/supplier-model'),
Employee      =require('./models/employee-model'),
Product         =require('./models/product-model'),
// Routes
adminRoute         =require('./routes/admin/admin-route'),
suppliersRoute       =require('./routes/supplier/supplier-route'),
productRoute          =require('./routes/product/productMain'),


// Express middlewares
app           =express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.json()) ;           // enable json objects type to be used
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));


// Connecting to DataBase Proceddure
const dbName = config.get("dbName")
mongoose.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }) 
.then(() =>console.log(`Connected to '${dbName}' DB successfully`)) // DB connected successfully
.catch((err) => console.log(`${dbName}' DB Connecting Error: ${err.message}`));  // Catch the error

// Redirecting to Routes
app.use("/admin",adminRoute);
app.use("/suppliers",suppliersRoute); //
app.use("/products", productRoute);

const port = config.get('portName')
const ip = config.get('ipName')
app.listen(port, ip,function(){
    console.log(`Server started on ${port}`);
});


