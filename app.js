//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));



mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true , useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});




const user = mongoose.model("User", userSchema);



app.get("/", function(req, res){

    res.render("home")
   
})

app.get("/login", function(req, res){

    res.render("login")
   
})

app.get("/register", function(req, res){

    res.render("register")
   
})

app.post("/register", function(req, res){


    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const userName = req.body.username;
        const password = hash;
    
         const users = new user({
           email:userName,
           password:password
    })
       users.save(function(err){
           if(!err){
               res.render("secrets");
           } else{
               res.send(err)
           }
       })

    });

    

});

app.post("/login", function(req, res){
    
    const userName = req.body.username;
    const password = req.body.password;


        user.findOne({email:userName}, function(err, foundUser){

            if(!err){
              if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result===true){
                        res.render("secrets")
                    }
                });
              }
            } else{
                res.send(err)
            }
        })
    
   
  

});



app.listen(3000, function(){
    console.log("server is running on port 3000")
})