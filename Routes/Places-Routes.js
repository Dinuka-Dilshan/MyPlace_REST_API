const express = require("express");
const router = express.Router();

const dummyPlaces = require("../DUMMY_DATA/places");

router.get("/", (req, res, next) => {
  
  res.json({
    place:dummyPlaces,
  });
});

router.get("/:placeID", (req, res, next) => {
  const placeID = req.params.placeID;
  const place = dummyPlaces.find((place) => {
    return place.id === placeID;
  });

  res.json({
    place,
  });
});

router.get("/users/:userID", (req, res, next) => {
  const userID = req.params.userID;
  const place = dummyPlaces.find((place) => {
    return place.creatorID === userID;
  });

  res.json({
    place,
  });
});

module.exports = router;
