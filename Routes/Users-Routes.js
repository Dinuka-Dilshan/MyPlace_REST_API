const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const usersControllers = require("../Controllers/Users-Controller");

router.get("/", usersControllers.getAllUsers);

router.post(
  "/login",
  check("email").normalizeEmail().notEmpty().isEmail(),
  check("password").notEmpty(),
  usersControllers.login
);

router.post(
  "/signup",
  check("email").normalizeEmail().notEmpty().isEmail(),
  check("password").notEmpty().withMessage('password cannot be empty').isStrongPassword({minLength:8}).withMessage('Minimum length is 8'),
  check("name").notEmpty().withMessage('name cannot be empty'),
  usersControllers.signup
);

module.exports = router;
