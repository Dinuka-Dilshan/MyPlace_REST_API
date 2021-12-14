require("dotenv").config();

const express = require("express");
const HttpError = require("./Models/HttpError");
const placesRoutes = require("./Routes/Places-Routes");
const userRoutes = require("./Routes/Users-Routes");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find the route", 404);
  next(error);
});

app.use((error, req, res, next) => {
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
    app.listen("3000", (error) => {
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
