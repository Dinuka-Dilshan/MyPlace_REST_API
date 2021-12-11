const express = require("express");
const router = express.Router();

const placeControllers = require("../Controllers/Places-Controllers");

router.get("/", placeControllers.getAllPlaces);

router.get("/:placeID", placeControllers.getPlacesByPlaceID);

router.get("/user/:userID", placeControllers.getPlacesByUserID);

router.post('/',placeControllers.addNewPlace);

router.patch('/:placeID',placeControllers.updatePlace);

router.delete('/:placeID',placeControllers.deletePlace);

module.exports = router;
