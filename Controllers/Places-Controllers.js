const HttpError = require("../Models/HttpError");
const dummyPlaces = require("../DUMMY_DATA/places");

const getAllPlaces = (req, res, next) => {
  res.json({
    place: dummyPlaces,
  });
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
  const place = dummyPlaces.find((place) => {
    return place.creatorID === userID;
  });

  if (place) {
    res.json({
      place,
    });
  } else {
    next(new HttpError("Cnnot find any place for the given User id", 404));
  }
};

const addNewPlace = (req, res, next) => {
  const { id, name, description, image, address, location, creatorID } = req.body;

  const newPlace = {
    id,
    name,
    description,
    image,
    address,
    location,
    creatorID,
  }

  dummyPlaces.push(newPlace);

  res.status(201).json({
    message: "OK",
    place:newPlace
  });
};

module.exports = {
  getAllPlaces,
  getPlacesByPlaceID,
  getPlacesByUserID,
  addNewPlace,
};
