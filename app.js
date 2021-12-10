const express = require('express');
const app = express();

const placesRoutes = require('./Routes/Places-Routes');

app.use(express.urlencoded({extended:true}));
app.use('/api/places',placesRoutes);

app.listen('3000',(error)=>{
    if(!error){
        console.log('server strted on port 3000');
    }
})