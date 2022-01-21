const HttpError = require("../Models/HttpError");
const { validationResult } = require("express-validator");
const getCoordinates = require("../Util/Location");
const Place = require("../Models/Place");
const User = require("../Models/User");
const mongoose = require("mongoose");

const fs  = require('fs');

const getAllPlaces = async (req, res, next) => {
  try {
    const places = await Place.find().exec();
    res.json(places);
  } catch (error) {
    next(new HttpError(error, 500));
  }
};

const getPlacesByPlaceID = async (req, res, next) => {
  const placeID = req.params.placeID;
  let foundPlace;

  try {
    foundPlace = await Place.findById(placeID).exec();
  } catch (error) {
    return next(
      new HttpError("Cnnot find any place for the given place id", 500)
    );
  }

  if (foundPlace) {
    foundPlace = { ...foundPlace.toObject(), id: foundPlace._id };
    delete foundPlace._id;
    delete foundPlace.__v;
    res.status(200).json({
      place: foundPlace,
    });
  } else {
    next(new HttpError("Cnnot find any place for the given place id", 404));
  }
};

const getPlacesByUserID = async (req, res, next) => {
  const userID = req.params.userID;
  let userWithPlaces;

  try {
    userWithPlaces = await User.findById(userID).populate('places');
  } catch (error) {
    return next(new HttpError("Cannot fetch data", 500));
  }
  if (userWithPlaces.places.length === 0) {
    return next(new HttpError("Cannot find a place for the given userID", 500));
  } else {
    res.json({
      places:userWithPlaces.places
    });
  }
};

const addNewPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, description, address, createrID } = req.body;

  let coordinates;

  try {
    coordinates = await getCoordinates(address);
  } catch (error) {
    return next(new HttpError("Cannot get coordinates for the address", 422));
  }

  const newPlace = new Place({
    name,
    description,
    image:req.file.path,
    address,
    location: coordinates,
    createrID,
  });

  let user;

  try {
    user = await User.findById(createrID);
  } catch (error) {
    return next(new HttpError("creating place failed", 500));
  }

  if (!user) {
    return next(new HttpError("cannot find a user for the provided id", 404));
    
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newPlace.save({ session: session });

    user.places.push(newPlace);

    const places = user.places;
    await User.findOneAndUpdate({_id:user._id.toString()},{places:places},{ session: session });
    await session.commitTransaction();

    res.status(201).json({
      message: "Place Added Successfully",
      place: newPlace,
    });

  } catch (error) {
    next(new HttpError(error, 500));
  }
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const placeID = req.params.placeID;
  const { description, name } = req.body;
  let updatedPlace,foundPlace;
  try {

   foundPlace = await Place.findById(placeID);

   if(foundPlace.createrID.toString() !== req.userData.userID){
     return next(new HttpError('You are not allowed to edit this place'),401);
   }

  updatedPlace = await Place.findByIdAndUpdate(
      placeID,
      { description, name },
      { returnDocument: "after" }
    ).exec();
  } catch (error) {
    return next(
      new HttpError("Cnnot find any place for the given place id", 404)
    );
  }

  res.status(200).json({
    place: updatedPlace,
  });
};

const deletePlace = async (req, res, next) => {

  const placeID = req.params.placeID;
  
  let foundPlace;

  try {
    foundPlace = await Place.findById(placeID)
  } catch (error) {
    return next(new HttpError("cannot find such a place", 404));
  }

 
  if(!foundPlace){
    return next(new HttpError("no places found for given id",404));
  }
 
  if(foundPlace.createrID.toString() !== req.userData.userID){
    return next(new HttpError("You are not allowed to delete this place"),401);
  }

  const imagePath = foundPlace.image;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await foundPlace.remove({session:session});
    const foundUser = await User.findById(foundPlace.createrID);
    console.log(foundUser._id)
    
    await User.findOneAndUpdate({_id:foundUser._id.toString()},{ $pullAll: {
      places: [placeID],
  },},{session:session});

    await session.commitTransaction();
  } catch (error) {
    return next(new HttpError("cannot delete the place", 500));
  }

  fs.unlink(imagePath,(error)=>{
    
  })

  res.status(200).json({
    message: "Deleted",
  });
};

module.exports = {
  getAllPlaces,
  getPlacesByPlaceID,
  getPlacesByUserID,
  addNewPlace,
  updatePlace,
  deletePlace,
};
