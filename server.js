const express=require('express');
const bodyparse =require('body-parser')
const _=require('lodash');
const {ObjectId}=require('mongodb')
const {mongoose}=require('./db/datacon')
const {ud} =require('./model/user')
const{authenticate}=require('./middleware/authenticate')
var app =express();
app.use(bodyparse.json())

app.post('/User',(req,res)=>
{
    var body =_.pick(req.body,['name','address','phone','email','password'])
    var udata = new ud(body)
    udata.generateAuthToken().then((result)=>
    {
        res.header('x-auth',result).send(udata)

    }).catch((e)=>
    {
        console.log(e)
         res.status(400).send(e)
    })

})

app.get('/user/me',authenticate,(req,res)=>
{
    res.send(req.user)

})
app.post('/user/login',authenticate,(req,res)=>{

    var body =_.pick(req.body,['email','password'])
    
    ud.findByCredentials(body.email,body.password).then((user)=>
    {
        res.send(req.user)
    }).catch((e)=>{

        res.status(400).send()
    })
    
})
app.patch('/user/:id',authenticate,(req,res)=>
{
    var id = req.params.id  
    console.log(id)
    var body = _.pick(req.body,['name','address','phone','email','password'])
    if(!ObjectId.isValid(id))
    {
         return res.status(400).send();
    }
    ud.findByIdAndUpdate(id,{$set:body},{new:true}).then((udata)=>
    {
         if(!udata)
         {
             return res.status(404).send()
         }
         res.send({udata})
    }).catch((e)=>
    {
        res.status(400).send()
    })
})

app.listen(6612,()=>
{
    console.log('work on port number 6600')
})