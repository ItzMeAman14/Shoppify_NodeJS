const express = require("express")
const path = require("path")
const fs = require("fs")
const collection = require("../config")
const multer  = require('multer')
const router = express.Router()

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

const Storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        return cb(null,`${Date.now()}-${file.originalname}`)
    }
  })


const upload = multer({ storage: Storage }).single('file')

router.get('/', async(req,res) => {
    let Data = await collection.findOne({isLogin:true});
    if(Data == null){
        Data = {
            isLogin:false
        }
    }
    res.render("../views/home",{data:Data});
})

router.get('/about',async(req,res) => {
    const data = await fetch("https://fakestoreapi.com/products");
    const text = await data.json();
    let Data = await collection.findOne({isLogin:true});
    res.render("../views/about",{data:Data,products:text})
})

router.get("/shop",async(req,res) => {
    const data = await fetch("https://fakestoreapi.com/products");
    const text = await data.json();
    let Data = await collection.findOne({isLogin:true});
    if(Data == null){
        Data = {
            isLogin:false
        }
    }
    res.render("../views/shop",{data:Data,ls:localStorage,products:text})
})

router.get("/cart",async(req,res) => {
    let Data = await collection.findOne({isLogin:true});
    if(Data == null){
        Data = {
            isLogin:false
        }
    }
    res.render("../views/cart",{data:Data,ls:localStorage})
})

router.get("/editProfile",async(req,res) => {
    let Data = await collection.findOne({isLogin:true});
    if(Data == null){
        Data = {
            isLogin:false
        }
    }
    res.render("../views/editProfile",{data:Data})
})

router.get("/shop/:id",async (req,res) => {
    let Data = await collection.findOne({isLogin:true});
    if(Data == null){
        Data = {
            isLogin:false
        }
    }
    const data = await fetch("https://fakestoreapi.com/products");
    const products = await data.json();
    myProduct = products.filter((e) => {
        return e.id == req.params.id;
    })
    res.render("../views/product",{product:myProduct[0],data:Data});
    
})

router.get("/login",async(req,res) => {
    let Data = await collection.findOne({isLogin:true});
    if(Data == null){
        Data = {
            isLogin:false
        }
    }
    res.render("../views/Login",{data:Data})
})

router.get("/signup",async(req,res) => {
    let Data = await collection.findOne({isLogin:true});
    if(Data == null){
        Data = {
            isLogin:false
        }
    }
    res.render("../views/SignUp",{data:Data})
})

// Sign Up
router.post("/signup",async (req,res) => {
    let pwd = req.body.password;
    let cpwd = req.body.cpwd;
    if(pwd == cpwd){

        const data = {
            username:req.body.username,
            email: req.body.email,
            password: req.body.password,
            address: req.body.address,
            landmark: req.body.address2,
            csz: `${req.body.city}-${req.body.state}-${req.body.zip}`,
            isLogin: false,
            img:"default-avatar.png"
        }
        const existingUser = await collection.findOne({email:data.email});
        if (existingUser){
            res.send("<script>alert('User Already Exist')</script>");
        }
        else{
            const userData = await collection.insertMany(data);
            res.redirect("/login")
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
        res.redirect("/")
    }
    else{
        res.send("<script>alert('Wrong Username or Password'); history.go(-1);</script>");
    }

})

// Updating Details

router.post("/updateDetails",upload, async(req,res) => {
    let url;
    if(req.file == undefined){
        url = "default-avatar.png";
    }
    else{
        url = req.file.filename;
    }
    let inputData = {
        username: req.body.username,
        email: req.body.email,
        address:req.body.Address,
        landmark:req.body.Landmark,
        image:url
    }
    console.log(inputData["image"])
    if(inputData["email"] != ""){
                
        await collection.updateMany({isLogin:true},{ $set:{
            email:inputData["email"]
    }
    })
}   
    // Updating Username Only
    if(inputData["username"] != ""){
        
        await collection.updateMany({isLogin:true},{ $set:{
            username:inputData["username"]
    }
    })  
    }
    if(inputData["landmark"] != ""){
        
        await collection.updateMany({isLogin:true},{ $set:{
            landmark:inputData["landmark"]
    }
    }) 
    }
    if(inputData["address"] != ""){
        
        await collection.updateMany({isLogin:true},{ $set:{
            address:inputData["address"]
    }
    }) 
    }
    if(inputData["image"] != ""){
        console.log("Inside")
        await collection.updateMany({isLogin:true},{ $set:{
            img:inputData["image"]
    }
})
    }
    // res.send("<script>alert('Updated SuccessFully.'); history.go(-1); </script>")
    res.redirect("/editProfile")
})

// Logout 
router.post("/logout",async (req,res) => {
    await collection.findOneAndUpdate({isLogin:true},{isLogin:false});
    res.redirect("/");
})

module.exports = router