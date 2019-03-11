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
           required:true,
           minlength:10,
           maxlength:10
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


userschema.methods.toJSON = function()
{
    var user = this
    var userObject  = user.toObject()
    return _.pick(userObject,['_id','email'])
}
userschema.methods.generateAuthToken = function()
{
    var user = this
    var access ='auth'
    var token =jwt.sign({_id: user._id.toHexString(),access},'udata66').toString()
    user.tokens.push({access,token})
    return user.save().then(()=>
    {
        return token
    })
}
userschema.statics.findByToken =function(token)
{
var user = this
var decode;
try{ 

   decode = jwt.verify(token,'udata66')
}
catch(e)
{
   return Promise.reject()
}
return user.findOne(
    {
        '_id':decode._id,
        'tokens.token':token,
        'tokens.access':'auth'

    })
}

userschema.pre('save',function(next)
{
    var user = this
    if(user.isModified('password'))
    {
         bcrypt.genSalt(10,(err,salt)=>
         {
             bcrypt.hash(user.password,salt,(err,hash)=>
             {
                 user.password =hash     
                 next()
             })
         })
    }
    else{
        next()
    }
})
 userschema.statics.findByCredentials = function(email,password)
 {
     var user = this

     return user.findOne({email}).then((user)=>
     {
         if(!user)
         {
             return Promise.reject()
         }
         return new Promise((resolve,reject) =>
         {
             bcrypt.compare(password,user.password,(err,res)=>
             {
                 if(res)
                 {
                     resolve(user)
                 }
                 else{
                     reject()
                 }
             })
         })
     })
 }

var ud = mongoose.model('Userdata',userschema)
module.exports = {ud}