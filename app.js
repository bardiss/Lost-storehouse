// RRr
var express   =require("express"),
bodyParser    =require("body-parser"),
methodOverride =require("method-override"),
mongoose      =require("mongoose"),
Supplier      =require('./models/supplier-model'),
Employee      =require('./models/employee-model'),
Product         =require('./models/product-model'),
adminRoute         =require('./routes/admin/admin-route'),
productRoute       =require('./routes/supplier/supplier-route'),
app           =express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/warehouse" ,{ useNewUrlParser: true });

app.use("/admin",adminRoute);
app.use("/products",productRoute);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started");
});


