const catchAsync = require('../utils/catch-async');
const HttpError = require('../models/http-error');
const fs = require('fs');
const mongoose = require('mongoose');
const User = require('../models/user');
const Favorite = require('../models/favorite');
const Status = require('../models/status');

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

const addToFavorites = (Model, idType, entertainment_type) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.body;
    const query = {};

    if (idType !== '') {
      query[idType] = id;
    }

    let user;
    let doc;
    let favorite;
    try {
      user = await User.findById(req.userData.userId);
      doc = await Model.findOne({ query });
      favorite = await Favorite.findOne({
        entertainment_type,
        user: user._id,
      });
    } catch (err) {
      return next(
        new HttpError(
          'Adding doc to favorite list failed, please try again',
          500
        )
      );
    }

    if (!user) {
      return next(new HttpError('Could not find user', 404));
    }

    if (!doc) {
      return next(new HttpError('Could not find doc', 404));
    }

    let addedDoc;
    if (!favorite) {
      addedDoc = new Favorite({
        entertainment_type,
        user: user._id,
      });
    } else {
      addedDoc = favorite;
    }

    console.log(addedDoc);
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      addedDoc.entertainment.push(doc);
      await addedDoc.save({ session: sess });
      if (user.favorite_list.includes(addedDoc._id)) {
        user.favorite_list.pull(addedDoc);
      }
      user.favorite_list.push(addedDoc);
      await user.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      console.log(err.message);
      return next(
        new HttpError(
          'Adding doc to favorites list failed, please try again later',
          500
        )
      );
    }

    res.status(201).json({ data: addedMovie });
  });

const removeFromFavorites = (Model, idType) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.body;
    const query = {};

    if (idType !== '') {
      query[idType] = id;
    }

    let doc;
    let favorite;
    try {
      doc = await Model.findOne({ query });
      favorite = await Favorite.findOne({ user: req.userData.userId });
    } catch (err) {
      console.log(err);
      return next(
        new HttpError(`Something went wrong, could not find document`, 500)
      );
    }

    if (!doc) {
      const error = new HttpError(`Could not find document with this id.`, 404);
      return next(error);
    }

    if (!favorite) {
      const error = new HttpError(
        `Could not find favorite list for user with this id.`,
        404
      );
      return next(error);
    }

    //const imagePath = movie.image;
    console.log(doc, favorite);
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      favorite.entertainment.pull(doc);
      favorite.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      console.log(err.message);
      return next(
        new HttpError(`Deleting document failed, please try again`, 500)
      );
    }

    //fs.unlink(imagePath, (err) => console.log(err));

    res.status(204).json({
      status: 'success',
      data: null,
      message: `Successfully removed from favorite list document with id ${movie._id}`,
    });
  });

const getAllFavorites = (entertainement_type) =>
  catchAsync(async (req, res, next) => {
    const userId = req.userData.userId;

    let userWithDocs;
    try {
      userWithDocs = await Favorite.findOne({
        user: userId,
        entertainment_type,
      }).populate('entertainment');
    } catch (err) {
      return next(
        new HttpError('Something went wrong, could not find docs.', 500)
      );
    }

    if (!userWithDocs || userWithDocs.length === 0) {
      return next(
        new HttpError('Could not find a document for the provided user id', 404)
      );
    }

    console.log(userWithDocs);

    res.status(200).json({
      favId: userWithDocs._id,
      favData: userWithDocs.entertainment,
    });
  });

const addToStatus = (Model, idType, entertainment_type) =>
  catchAsync(async (req, res, next) => {
    const { id, statusValue } = req.body;

    const query = {};

    if (idType !== '') {
      query[idType] = id;
    }

    let user;
    let doc;
    let status;
    try {
      user = await User.findById(req.userData.userId);
      movie = await Model.findOne({ query });
      status = await Status.findOne({
        entertainment_type,
        user: user._id,
        status: statusValue,
      });
    } catch (err) {
      return next(
        new HttpError(
          'Adding document to status list failed, please try again',
          500
        )
      );
    }

    if (!user) {
      return next(new HttpError('Could not find user', 404));
    }

    if (!doc) {
      return next(new HttpError('Could not find document', 404));
    }

    let addedDocument;
    if (!status) {
      addedDocument = new Status({
        entertainment_type,
        user: user._id,
        status: statusValue,
      });
    } else {
      addedDocument = status;
    }

    console.log(user);
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      addedDocument.entertainment.push(doc);
      await addedDocument.save({ session: sess });
      if (user.status_list.includes(addedDocument._id)) {
        user.status_list.pull(addedDocument);
      }
      user.status_list.push(addedDocument);
      await user.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      console.log(err.message);
      return next(
        new HttpError(
          'Adding document to status list failed, please try again later',
          500
        )
      );
    }

    res.status(201).json({ data: addedDocument });
  });

const updateStatus = (Model, idType) =>
  catchAsync(async (req, res, next) => {
    const { id, statusValue } = req.body;

    const query = {};

    if (idType !== '') {
      query[idType] = id;
    }

    let doc;
    let status;
    try {
      doc = await Model.findOne({ query });
      status = await Status.findOne({
        user: req.userData.userId,
        status: statusValue,
      });
    } catch (err) {
      console.log(err);
      return next(
        new HttpError(`Something went wrong, could not find document`, 500)
      );
    }

    if (!doc) {
      const error = new HttpError(`Could not find document with this id.`, 404);
      return next(error);
    }

    if (!status) {
      const error = new HttpError(
        `Could not find status list for user with this id.`,
        404
      );
      return next(error);
    }

    //const imagePath = movie.image;
    console.log(status, document);
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      status.entertainment.pull(doc);
      status.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      console.log(err.message);
      return next(
        new HttpError(`Updating document status failed, please try again`, 500)
      );
    }

    //fs.unlink(imagePath, (err) => console.log(err));

    res.status(204).json({
      status: 'success',
      data: null,
      message: `Successfully updated status of document with id ${movie._id}`,
    });
  });

const getAllStatusDocs = (entertainment_type) =>
  catchAsync(async (req, res, next) => {
    const userId = req.userData.userId;

    let statusToDo;
    let statusDone;
    let statusDoing;
    try {
      statusToDo = await Status.findOne({
        user: userId,
        entertainment_type,
        status: 'to_do',
      }).populate('entertainment');
      statusDoing = await Status.findOne({
        user: userId,
        entertainment_type,
        status: 'doing',
      }).populate('entertainment');
      statusDone = await Status.findOne({
        user: userId,
        entertainment_type,
        status: 'done',
      }).populate('entertainment');
    } catch (err) {
      return next(
        new HttpError('Something went wrong, could not find documents.', 500)
      );
    }

    console.log(statusToDo, statusDone, statusDoing);

    if (
      !statusToDo ||
      statusToDo.length === 0 ||
      !statusDone ||
      statusDone.length === 0 ||
      !statusDoing ||
      statusDoing.length === 0
    ) {
      return res.status(200).json({ statusToDo, statusDone, statusDoing });
    }

    res.status(200).json({
      toDoListId: statusToDo._id,
      toDoDocs: statusToDo.entertainment,
      doneListId: statusDone._id,
      doneDocs: statusDone.entertainment,
      doingListId: statusDone._id,
      doingDocs: statusDone.entertainment,
    });
  });

exports.delete = deleteOne;
exports.update = updateOne;
exports.create = createOne;
exports.getOne = getOne;
exports.getAll = getAllDocsByUserId;
exports.addDocToFavorites = addToFavorites;
exports.removeDocFromFavorites = removeFromFavorites;
exports.getAllFavoriteDocs = getAllFavorites;
exports.addDocToStatus = addToStatus;
exports.updateStatus = updateStatus;
exports.getAllStatusDocs = getAllStatusDocs;
