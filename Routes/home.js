const express = require("express")
const collection = require("../config")
const router = express.Router()

router.get('/',(req,res) => {
    res.render("../views/home");
})

router.get('/about',(req,res) => {
    res.render("../views/about")
})

router.get("/shop",(req,res) => {
    res.render("../views/shop")
})

router.get("/editProfile",(req,res) => {
    res.render("../views/editProfile")
})

router.get("/shop/:id",async (req,res) => {
    const data = await fetch("https://fakestoreapi.com/products");
    const products = await data.json();
    myProduct = products.filter((e) => {
        return e.id == req.params.id;
    })
    res.render("../views/product",{product:myProduct[0]});
    
})

router.get("/login",(req,res) => {
    res.render("../views/Login")
})

router.get("/signup",(req,res) => {
    res.render("../views/SignUp")
})

// Sign Up
router.post("/signup",async (req,res) => {
    let pwd = req.body.password;
    let cpwd = req.body.cpwd;
    if(pwd == cpwd){

        const data = {
            username:"user",
            email: req.body.email,
            password: req.body.password,
            address: req.body.address,
            landmark: req.body.address2,
            csz: `${req.body.city}-${req.body.state}-${req.body.zip}`,
            isLogin: false
        }
        const existingUser = await collection.findOne({email:data.email});
        if (existingUser){
            res.send("<script>alert('User Already Exist')</script>");
        }
        else{
            const userData = await collection.insertMany(data);
            res.render("../views/Login");
            res.send("<script>alert('Account Created SuccessFully')</script>")
        }
    }
    else{
        res.send("<script>alert('Password Not Match.Try Again'); history.go(-2)</script>");
    }
    })

// Login 
router.post("/login",async (req,res) => {
    const LoginData = {
        email: req.body.LogInEmail,
        password: req.body.LogInPassword
    }
    const ValidateEmail = await collection.findOne({email:LoginData.email,password:LoginData.password});
    if(ValidateEmail){
        const data = await collection.findOneAndUpdate({email:LoginData.email},{isLogin:true});
        res.send("<script>history.go(-2)</script>")
    }
    else{
        res.send("<script>alert('Wrong Username or Password'); history.go(-1)</script>");
    }

})

// Logout 
router.post("/logout",async (req,res) => {
    const data = await collection.findOneAndUpdate({isLogin:true},{isLogin:false});
    res.send("<script>history.go(-1);</script>")
})

router.get("/users",async (req,res) => {
    const Data = await collection.find({});
    res.json(Data);
})

module.exports = router