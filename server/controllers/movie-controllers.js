const multer = require("multer");
const sharp = require("sharp");

const Movie = require("../models/movie");
const catchAsync = require("../utils/catch-async");
const factory = require("../controllers/handler-factory");

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

const uploadImage = upload.single("image");

const resizeUserPhoto = async (req, res, next) => {
  if (!req.image) return next();

  req.image.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  await sharp(req.image.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/movies/${req.image.filename}`);

  next();
};

exports.getAllMovies = factory.getAll(Movie);
exports.getMovie = factory.getOne(Movie, "crew", "Movie");
exports.createMovie = factory.create(Movie);
exports.deleteMovie = factory.delete(Movie, "Movie");
exports.updateMovie = factory.update(Movie, "Movie");
