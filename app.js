require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const saultRound = 10;


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

    bcrypt.hash(req.body.password, saultRound, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });

        newUser.save((err)=>{
            if(err){
                console.log(err);
            } else {
                res.render("secrets")
            }
        })
    });

    
        
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
                bcrypt.compare(password, foundUser.password, function(err, result) {
                   if( result == true){
                       res.render('secrets')
                   }
                    
                });

            }
        }
    })
});


app.listen(Port,(req,res)=>{
    console.log('The port is listing at 3000')
})