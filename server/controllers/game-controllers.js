const multer = require("multer");
const sharp = require("sharp");

const Game = require("../models/game");
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
    .toFile(`uploads/games/${req.image.filename}`);

  next();
};

exports.getAllGames = factory.getAll(Game);
exports.getGame = factory.getOne(Game, "crew", "Game");
exports.createGame = factory.create(Game);
exports.deleteGame = factory.delete(Game, "Game");
exports.updateGame = factory.update(Game, "Game");
