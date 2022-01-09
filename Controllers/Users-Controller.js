const HttpError = require("../Models/HttpError");
const { validationResult } = require("express-validator");
const User = require("../Models/User");

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
    foundUser = await User.findOne({ email, password }).exec();
  } catch (error) {
    return next(new HttpError("cannot find user", 404));
  }

  if (foundUser && foundUser.email === email) {
    res.json({
      message: "Logged In",
    });
  } else {
    return next(
      new HttpError("Cannot find a user. Credentials seems to be wrong", 401)
    );
  }
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array()[0].param + ` is invalid` });
  }

  const { name, email, password, image } = req.body;

  const addedUser = new User({
    name,
    email,
    password,
    image,
    places:[]
  });

  try {
    await addedUser.save();
    res.json({ user: addedUser });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllUsers,
  login,
  signup,
};
