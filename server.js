const express=require('express');
const bodyparse =require('body-parser')
const _=require('lodash');
const {ObjectId}=require('mongodb')

const {mongoose}=require('./data-connection/connection')
const {ud} =require('./model/user')
const {authenticate}=require('./middleware/authenticate')

var app =express();
app.use(bodyparse.json())
app.post('/User',(req,res)=>
{
    var body =_.pick(req.body,['Name','Address','email','Phone:','password'])
    console.log(body)
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


app.listen(6600,()=>
{
    console.log('work on port number 6600')
})