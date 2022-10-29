const fs = require('fs');

const mongoose = require('mongoose');
const multer = require('multer');
const sharp = require('sharp');

const catchAsync = require('../utils/catch-async');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new HttpError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadImage = upload.single('image');

const resizeImage = (docName) =>
  catchAsync(async (req, res, next) => {
    if (!req.image) return next();

    req.image.filename = `${docName}-${Date.now()}.jpeg`;

    await sharp(req.image.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`uploads/${docName}s/${req.image.filename}`);

    next();
  });

const deleteOne = (Model, docName) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      const error = new HttpError(
        `Could not find ${docName} for this id.`,
        404
      );
      return next(error);
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

const updateOne = (Model, docName) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!doc) {
      const error = new HttpError(
        `Could not find ${docName} for this id.`,
        404
      );
      return next(error);
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

const getOne = (Model, popOptions, docName) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;

    if (!doc) {
      const error = new HttpError(
        `Could not find ${docName} for this id.`,
        404
      );
      return next(error);
    }

    res.status(200).json({ status: 'success', data: { data: doc } });
  });

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.find({});

    //TODO add filter/sort/paginate/limit

    res
      .status(200)
      .json({ status: 'success', results: doc.length, data: { data: doc } });
  });

exports.delete = deleteOne;
exports.update = updateOne;
exports.create = createOne;
exports.getOne = getOne;
exports.getAll = getAll;
exports.upload = uploadImage;
exports.resizeImage = resizeImage;
