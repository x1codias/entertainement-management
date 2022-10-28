const multer = require("multer");
const sharp = require("sharp");

const Book = require("../models/book");
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
    .toFile(`uploads/books/${req.image.filename}`);

  next();
};

exports.getAllBooks = factory.getAll(Book);
exports.getBook = factory.getOne(Book, "crew", "Book");
exports.createBook = factory.create(Book);
exports.deleteBook = factory.delete(Book, "Book");
exports.updateBook = factory.update(Book, "Book");
