require("dotenv").config();

const fs = require('fs');
const path = require('path');

const express = require("express");
const HttpError = require("./Models/HttpError");
const placesRoutes = require("./Routes/Places-Routes");
const userRoutes = require("./Routes/Users-Routes");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads/images',express.static(path.join('uploads','images')));

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','*');
  res.setHeader('Access-Control-Allow-Methods','*');
  next();
})

app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find the route", 404);
  next(error);
});

app.use((error, req, res, next) => {

  if(req.file){
    fs.unlink(req.file.path,(err)=>{
      if(err) console.log(err);
    })
  }

  if (res.headerSent) {
    next();
  } else {
    res.status(error.code || 500);
    res.json({
      message: error.message || "Unknown Error Occured",
    });
  }
});

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen("5000", (error) => {
      if(!error){
        console.log('connected to database')
      }else{
        console.log(error);
      }
    });
  })
  .catch((error) => {
    console.log(error);
  });
