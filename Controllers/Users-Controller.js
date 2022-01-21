require('dotenv').config();

const HttpError = require("../Models/HttpError");
const { validationResult } = require("express-validator");
const User = require("../Models/User");

const bcrypt = require("bcryptjs");
const { off } = require("../Models/User");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res, next) => {
  let allUsers;
  try {
    allUsers = await User.find({}, "-password").exec();
  } catch (error) {
    return next(new HttpError("cannot load data", 500));
  }

  filteredUsers = allUsers.map((user) => {
    const { name, email, image, places, _id: id } = user;
    return { name, email, image, places, id };
  });
  res.status(200).json({
    users: filteredUsers,
  });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  let foundUser;

  try {
    foundUser = await User.findOne({ email }).exec();
  } catch (error) {
    return next(new HttpError("Login failed, please try again", 500));
  }

  if (!foundUser) {
    return next(new HttpError("Credentials seems to be wrong", 404));
  }

  let isValid = false;

  try {
    isValid = await bcrypt.compare(password, foundUser.password);
  } catch (error) {
    return next(new HttpError("Login failed, please try again", 500));
  }

  let token;
  try {
    token = jwt.sign(
      {
        userID: foundUser._id.toString(),
        email: foundUser.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
  } catch (error) {
    return next(new HttpError("Login failed, please try again", 500));
  }

  if (isValid && foundUser) {
    res.status(200).json({
      token,
      userID: foundUser._id
    });
  } else {
    return next(new HttpError("Credentials seems to be wrong", 401));
  }
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array()[0].param + ` is invalid` });
  }

  const { name, email, password } = req.body;

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Signing Up failed"));
  }

  const addedUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: [],
  });

  let token;
  try {
    token = jwt.sign(
      {
        userID: addedUser._id.toString(),
        email: addedUser.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
  } catch (error) {
    return next(new HttpError("Login failed, please try again", 500));
  }

  try {
    await addedUser.save();
    res.json({ token, user: addedUser });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  login,
  signup,
};
