const express=require('express');
const aiRoutes=require('./routes/ai.routes');
const cors=require('cors');

const app=express();

app.use(cors());

app.use(express.json())   //middlware

app.get('/',(req,res)=>{
    res.send("Hello world");
})

app.use('/ai',aiRoutes)  //ai routes is middleware here

module.exports=app;