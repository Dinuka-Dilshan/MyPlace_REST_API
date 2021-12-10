const express = require('express');
const app = express();

const placesRoutes = require('./Routes/Places-Routes');

app.use(express.urlencoded({extended:true}));
app.use('/api/places',placesRoutes);


app.use((error,req,res,next)=>{
    if(res.headerSent){
        next();
    }else{
        res.status(error.code || 500);
        res.json({
            message:error.message || 'Unknown Error Occured'
        })
    }
});

app.listen('3000',(error)=>{
    if(!error){
        console.log('server strted on port 3000');
    }
})