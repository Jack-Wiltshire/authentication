//Requirement/Dependencies

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

//App set: Express

const app = express();

//Database Connection.

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

//Database Schema's and Model's - Encrypted

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

//Requirement Settings

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//Routes

app.get("/", function(req,res){
    res.render("home");
});

app.route("/login")
    .get(function(req,res){
        res.render("login");
    })
    .post(function(req,res){
        const userName = req.body.username;
        const password = md5(req.body.password);
        User.findOne({email: userName}, function(err, foundUser){
            if (err) {
                console.log(err);
            } else {
                if(foundUser) {
                    if(foundUser.password === password){
                        res.render("secrets");
                    }
                }
            }
        });
    });

app.route("/register")
    .get(function(req,res){
        res.render("register");
    })
    .post(function(req,res){
        const newUser = new User ({
            email: req.body.username,
            password: md5(req.body.password),
        });
        newUser.save(function(err){
            if(!err) {
                res.render("secrets");
            } else {
                res.send(err);
            }
        });
    });


//Server Connection

app.listen(3000, function(req,res){
    console.log("Successfully started server on port 3000");
});