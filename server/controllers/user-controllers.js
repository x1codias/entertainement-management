const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const factory = require('../controllers/handler-factory');
const catchAsync = require('../utils/catch-async');

const signup = async (req, res, next) => {
  /*const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError(`${errors}`, 422);
    return next(error);
  }*/

  console.log(req.body);

  const { username, email, password /*, avatar*/ } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      `Error: Signing up failed, please try again later`
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User with the provided email already exists, please login instead',
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      `Error: Could not create user, please try again`,
      500
    );
    return next(error);
  }

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    favorite_list: [],
    status_list: [],
    //imageUrl: avatar,
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError(`Error ${err.message}`, 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(`Error ${err.message}`, 500);
    return next(error);
  }

  res.status(201).json({
    userId: newUser.id,
    username: newUser.username,
    email: newUser.email,
    token: token,
  });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError(`Error: ${errors}`, 422);
    return next(error);
  }

  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email }).populate(
      'favorite_list'
    );
  } catch (err) {
    const error = new HttpError(`Error: ${err.message}`);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError('User with the provided email not found', 422);
    return next(error);
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(`Error ${err.message}`, 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'The provided password is incorrect, please try again',
      422
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(`Error ${err.message}`, 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    username: existingUser.username,
    token: token,
  });
};

const findUser = () =>
  catchAsync(async (req, res, next) => {
    let user;
    try {
      user = await user.findById(req.userData.userId);
    } catch (err) {
      return next(new HttpError('Creating doc failed, please try again', 500));
    }

    if (!user) {
      return next(
        new HttpError('Could not find user for the provided id', 404)
      );
    }

    return user;
  });

exports.signup = signup;
exports.login = login;
exports.findUser = findUser;
//exports.uploadUserImage = factory.upload;
//exports.resizeUserImage = factory.resizeImage('user');
