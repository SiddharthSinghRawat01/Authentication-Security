const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
// mongoose-encryption encrypt when db.save and decrypt when db.find
const encrypt = require("mongoose-encryption");


const app = express();
const Port = 3000;

app.set('view engine', 'ejs');
app.set('views','./views');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/userDB")


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "This is  our secret.";
userSchema.plugin(encrypt,{secret: secret, encryptedFields:["password"]})


const User = new mongoose.model("User", userSchema)




app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/register',(req,res)=>{
    res.render('register');
});

app.post("/register",(req,res)=>{
    const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });

        newUser.save((err)=>{
            if(err){
                console.log(err);
            } else {
                res.render("secrets")
            }
        })
        
});

app.post("/login",(req,res)=>{
    const username = req.body.username
    const password = req.body.password

    User.findOne({email: username},(err,foundUser)=>{
        if(err){
            console.log(err)
        } else {
            if(foundUser){
                console.log(foundUser)
                if(foundUser.password === password){
                    console.log("password correct")
                    res.render('secrets')
                }

            }
        }
    })
});


app.listen(Port,(req,res)=>{
    console.log('The port is listing at 3000')
})