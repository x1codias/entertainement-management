const catchAsync = require('../utils/catch-async');
const HttpError = require('../models/http-error');
const fs = require('fs');
const mongoose = require('mongoose');

const deleteOne = (Model, docName) =>
  catchAsync(async (req, res, next) => {
    const docId = req.params.id;

    let doc;
    try {
      doc = await Model.findById(docId).populate('users');
    } catch (err) {
      return next(
        new HttpError(`Something went wrong, could not find ${docName}`, 500)
      );
    }

    if (!doc) {
      const error = new HttpError(
        `Could not find ${docName} with this id.`,
        404
      );
      return next(error);
    }

    const imagePath = place.image;

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await doc.remove({ session: sess });
      /*const loggedUser = await User.find(
        (user) => user._id === req.userData.userId
      );
      loggedUser;*/
      await doc.users.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      return next(
        new HttpError(`Deleting ${docName} failed, please try again`, 500)
      );
    }

    fs.unlink(imagePath, (err) => console.log(err));

    res.status(204).json({
      status: 'success',
      data: null,
      message: `Successfully deleted ${docName} with id ${docId}`,
    });
  });

const updateOne = (Model, docName, user, userDoc) =>
  catchAsync(async (req, res, next) => {
    const { id, title, description, image, favorite } = req.body;
    const docId = req.params.id;

    console.log(req.body, user, userDoc);

    let updatedDoc;
    try {
      updatedDoc = await Model.findById(docId);
    } catch (err) {
      const createdDoc = createOne(
        Model,
        user,
        userDoc,
        id,
        title,
        description,
        image,
        favorite
      );

      res.status(201).json({
        status: 'success',
        data: {
          data: createdDoc,
        },
      });
    }

    if (!updatedDoc) {
    }

    updatedDoc.favorite = favorite;

    try {
      await updatedDoc.save();
    } catch (err) {
      return next(
        new HttpError(`Something went wrong, could not find ${docName}`, 500)
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedDoc,
      },
    });
  });

const createOne = (
  Model,
  user,
  userDoc,
  id,
  title,
  description,
  image_url,
  favorite
) =>
  catchAsync(async (next) => {
    const createdDoc = new Model({
      id,
      title,
      description,
      image_url,
      favorite,
    });

    createdDoc.users.push(user);

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdDoc.save({ session: sess });
      userDoc.push(createdDoc);
      await user.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      return next(
        new HttpError('Creating doc failed, please try again later', 500)
      );
    }

    return createdDoc;
  });

const getOne = (Model, popOptions = '', docName) =>
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

const getAllDocsByUserId = (Model) =>
  catchAsync(async (req, res, next) => {
    const userId = req.params.uname;

    let userWithDocs;
    try {
      userWithDocs = await Model.findById(userId).populate(
        'movies shows books games'
      );
    } catch (err) {
      return next(
        new HttpError('Something went wrong, could not find docs.', 500)
      );
    }

    if (
      !userWithDocs ||
      userWithDocs.movies.length === 0 ||
      userWithDocs.shows.length === 0 ||
      userWithDocs.books.length === 0 ||
      userWithDocs.games.length === 0
    ) {
      return next(
        new HttpError(
          'Could not find a movie, show, book or game for the provided user id',
          404
        )
      );
    }

    res.status(200).json({
      docs: userWithDocs.map((doc) => doc.toObject({ getters: true })),
    });
  });

exports.delete = deleteOne;
exports.update = updateOne;
exports.create = createOne;
exports.getOne = getOne;
exports.getAll = getAllDocsByUserId;
