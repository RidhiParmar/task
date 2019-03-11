const mongoose =require('mongoose') 
const validator =require('validator')
const jwt = require('jsonwebtoken')
const _= require('lodash')
const bcrypt =require('bcryptjs')

var userschema = new mongoose.Schema({
    Name:{
        type:String,
        required:true,
    },
    Address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        minlength:1,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:'{value}is not valid email'
        }

    },
    Phone:{
           type:Number,
           required:true
    },
    password:{
        type:String,
        require:true,
        minlength:6,    
    },
    tokens:[{
        access:{

            type:String,
            required:true
        },
        token:{
            type:String,
            required:true

        }
    }]
})
var ud = mongoose.model('Userdata',userschema)
module.exports = {ud}