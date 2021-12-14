const HttpError = require("../Models/HttpError");
let dummyPlaces = require("../DUMMY_DATA/places");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const getCoordinates = require("../Util/Location");
const Place = require('../Models/Place');


const getAllPlaces = async (req, res, next) => {
  
  try{
    const places = await Place.find().exec();
    res.json(places);
  }catch(error){
    next(new HttpError(error,500));
  }

};

const getPlacesByPlaceID = (req, res, next) => {
  const placeID = req.params.placeID;
  const place = dummyPlaces.find((place) => {
    return place.id === placeID;
  });

  if (place) {
    res.json({
      place,
    });
  } else {
    next(new HttpError("Cnnot find any place for the given place id", 404));
  }
};

const getPlacesByUserID = (req, res, next) => {
  const userID = req.params.userID;
  const places = dummyPlaces.filter((place) => {
    return place.creatorID === userID;
  });

  if (places || places.length > 0) {
    res.json({
      places,
    });
  } else {
    next(new HttpError("Cnnot find any place for the given User id", 404));
  }
};

const addNewPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, description,  address, createrID } = req.body;

  let coordinates;

  try{
    coordinates =  await getCoordinates(address);
  }catch(error){
      return next(new HttpError('Cannot get coordinates for the address',422));
  }


  const newPlace = new Place({
    name,
    description,
    image:'https://tinyurl.com/nckay2pp',
    address,
    location:coordinates,
    createrID,
  })

  try{
    await newPlace.save();
    res.status(201).json({
      message: "OK",
      place: newPlace,
    });
  }catch(error){
    next(new HttpError(error,500));
  }

  
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const placeID = req.params.placeID;
  const { description, name } = req.body;

  const place = { ...dummyPlaces.find((place) => place.id === placeID) };

  if (place.id) {
    place.description = description;
    place.name = name;
    dummyPlaces[placeID] = place;
    res.status(200).json({
      place,
    });
  } else {
    next(new HttpError("Cnnot find any place for the given place id", 404));
  }
};

const deletePlace = (req, res, next) => {
  const placeID = req.params.placeID;
  const previousLength = dummyPlaces.length;
  dummyPlaces = dummyPlaces.filter((place) => place.id !== placeID);

  if (previousLength !== dummyPlaces.length) {
    res.status(200).json({
      message: "Deleted",
    });
  } else {
    next(new HttpError("Cnnot find any place for the given place id", 404));
  }
};

module.exports = {
  getAllPlaces,
  getPlacesByPlaceID,
  getPlacesByUserID,
  addNewPlace,
  updatePlace,
  deletePlace,
};
