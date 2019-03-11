var mongoose =require('mongoose')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/userdata',(err,db)=>
{
    if(err)
    {
        console.log('connection not done')
    }
    else{
        console.log('connection done')
    }
})
module.exports={mongoose}