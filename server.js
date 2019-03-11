const express=require('express');
const bodyparse =require('body-parser')
const _=require('lodash');
const {ObjectId}=require('mongodb')

const {mongoose}=require('./data-connection/connection')
const {ud} =require('./model/user')
const {authenticate}=require('./middleware/authenticate')

var app =express();
app.use(bodyparse.json())
app.post('/Udata',(req,res)=>
{
   var udata = new ud({
           Name:req.body.Name,
           Address:req.body.Address,
           email:req.body.email,
           Phone:req.body.phone,
           Password:req.body.passowrd
       })
       udata.save().then((data)=>
       {
            res.send(data)
       },(e)=>
       {
           res.status(400).send(e);
       })
})