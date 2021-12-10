const express = require("express");
const router = express.Router();

const placeControllers = require("../Controllers/Places-Controllers");

router.get("/", placeControllers.getAllPlaces);

router.get("/:placeID", placeControllers.getPlacesByPlaceID);

router.get("/user/:userID", placeControllers.getPlacesByUserID);

module.exports = router;
