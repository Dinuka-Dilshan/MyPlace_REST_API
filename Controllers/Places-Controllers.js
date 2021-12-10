const HttpError = require('../Models/HttpError');
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

exports.getAllPlaces = getAllPlaces;
exports.getPlacesByPlaceID = getPlacesByPlaceID;
exports.getPlacesByUserID = getPlacesByUserID;