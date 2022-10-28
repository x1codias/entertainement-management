const multer = require("multer");
const sharp = require("sharp");

const Anime = require("../models/anime");
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
    .toFile(`uploads/animes/${req.image.filename}`);

  next();
};

exports.getAllAnimes = factory.getAll(Anime);
exports.getAnime = factory.getOne(Anime, "crew", "Anime");
exports.createAnime = factory.create(Anime);
exports.deleteAnime = factory.delete(Anime, "Anime");
exports.updateAnime = factory.update(Anime, "Anime");
