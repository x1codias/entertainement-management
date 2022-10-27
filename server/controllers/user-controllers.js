const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const sharp = require("sharp");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new HttpError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadImage = upload.single("avatar");

const resizeUserPhoto = async (req, res, next) => {
  if (!req.avatar) return next();

  req.avatar.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  await sharp(req.avatar.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${req.avatar.filename}`);

  next();
};

const signup = async (req, res, next) => {
  /*const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError(`${errors}`, 422);
    return next(error);
  }*/

  const { username, email, password, avatar } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(`Error: ${err.message}`);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User with the provided email already exists, please login instead",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(`Error ${err.message}`, 500);
    return next(error);
  }

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    imageUrl: avatar,
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
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(`Error ${err.message}`, 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: newUser.id, email: newUser.email, token: token });
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
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(`Error: ${err.message}`);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("User with the provided email not found", 422);
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
      "The provided password is incorrect, please try again",
      422
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(`Error ${err.message}`, 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.signup = signup;
exports.login = login;
exports.uploadImage = uploadImage;
exports.resizeUserPhoto = resizeUserPhoto;
