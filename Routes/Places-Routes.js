const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const fileUpload = require('../middleware/FileUpload');
const auth = require('../middleware/auth');

const placeControllers = require("../Controllers/Places-Controllers");

router.get("/", placeControllers.getAllPlaces);

router.get("/:placeID", placeControllers.getPlacesByPlaceID);

router.get("/user/:userID", placeControllers.getPlacesByUserID);

router.use(auth);

router.post(
  "/",
  fileUpload.single('image'),
  check("description")
    .notEmpty()
    .withMessage("decription cannot be empty")
    .isLength({ min: 5 })
    .withMessage("minimum length is 5"),
  check("name").notEmpty().withMessage("Name cannot be empty"),
  placeControllers.addNewPlace
);

router.patch(
  "/:placeID",
  check("description")
    .notEmpty()
    .withMessage("decription cannot be empty")
    .isLength({ min: 5 })
    .withMessage("minimum length is 5"),
  check("name").notEmpty().withMessage("Name cannot be empty"),
  placeControllers.updatePlace
);

router.delete("/:placeID", placeControllers.deletePlace);

module.exports = router;
