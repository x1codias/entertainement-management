/*const Movie = require('../models/movie');
const factory = require('../controllers/handler-factory');
const userController = require('./user-controllers');

exports.getAllMovies = factory.getAll(Movie);
exports.getMovie = factory.getOne(Movie, 'Movie');
exports.deleteMovie = factory.delete(Movie, 'Movie');
exports.updateMovie = factory.update(Movie, 'Movie', user, user.movies);*/
const Movie = require('../models/movie');
const User = require('../models/user');
const Favorite = require('../models/favorite');
const catchAsync = require('../utils/catch-async');
const HttpError = require('../models/http-error');
const fs = require('fs');
const mongoose = require('mongoose');
const e = require('express');

const deleteOne = () =>
  catchAsync(async (req, res, next) => {
    const movieId = req.params.id;

    let movie;
    try {
      movie = await Movie.findById(movieId).populate('users');
    } catch (err) {
      return next(
        new HttpError(`Something went wrong, could not find movie`, 500)
      );
    }

    if (!movie) {
      const error = new HttpError(`Could not find movie with this id.`, 404);
      return next(error);
    }

    const imagePath = movie.image;

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await movie.remove({ session: sess });
      const loggedUser = await User.find(req.userData.userId);
      loggedUser.movies.pull(movie);
      await movie.users.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      return next(
        new HttpError(`Deleting movie failed, please try again`, 500)
      );
    }

    fs.unlink(imagePath, (err) => console.log(err));

    res.status(204).json({
      status: 'success',
      data: null,
      message: `Successfully deleted movie with id ${movie._id}`,
    });
  });

const updateOne = () =>
  catchAsync(async (req, res, next) => {
    const { id, title, description, image, favorite } = req.body;
    const movieId = req.params.id;

    let loggedUser;
    let updatedMovie;
    try {
      updatedMovie = await Movie.findById(movieId);
      loggedUser = await User.findById(req.userData.userId);
    } catch (err) {
      /*const createdMovie = createOne(
        loggedUser,
        id,
        title,
        description,
        image,
        favorite,
        status
      );

      res.status(201).json({
        status: 'success',
        data: {
          data: createdMovie,
        },
      });*/
      return next(
        new HttpError(`Something went wrong, could not find movie`, 500)
      );
    }

    updatedMovie.favorite = favorite;
    //updatedMovie.status = status;

    try {
      await updatedMovie.save();
    } catch (err) {
      return next(
        new HttpError(`Something went wrong, could not find movie`, 500)
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedMovie,
      },
    });
  });

const addToFavorites = () =>
  catchAsync(async (req, res, next) => {
    const { movieId } = req.body;

    let user;
    let movie;
    let favorite;
    try {
      user = await User.findById(req.userData.userId);
      movie = await Movie.findOne({ movieId: movieId });
      favorite = await Favorite.findOne({
        entertainement_type: 'Movie',
        user: user._id,
      });
    } catch (err) {
      return next(
        new HttpError(
          'Adding movie to favorite list failed, please try again',
          500
        )
      );
    }

    if (!user) {
      return next(new HttpError('Could not find user', 404));
    }

    if (!movie) {
      return next(new HttpError('Could not find movie', 404));
    }

    let addedMovie;
    if (!favorite) {
      addedMovie = new Favorite({
        entertainment_type: 'Movie',
        user: user._id,
      });
    } else {
      addedMovie = favorite;
    }

    console.log(addedMovie);
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      addedMovie.entertainment.push(movie);
      await addedMovie.save({ session: sess });
      if (user.favorite_list.includes(addedMovie._id)) {
        user.favorite_list.pull(addedMovie);
      }
      user.favorite_list.push(addedMovie);
      await user.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      console.log(err.message);
      return next(
        new HttpError('Creating movie failed, please try again later', 500)
      );
    }

    res.status(201).json({ data: addedMovie });
  });

const removeFromFavorite = () =>
  catchAsync(async (req, res, next) => {
    const movieId = req.params.id;

    let movie;
    let loggedUser;
    try {
      movie = await Favorite.findOne({ movieId: movieId }).populate('users');
      loggedUser = await User.find(req.userData.userId);
    } catch (err) {
      return next(
        new HttpError(`Something went wrong, could not find movie`, 500)
      );
    }

    if (!movie) {
      const error = new HttpError(`Could not find movie with this id.`, 404);
      return next(error);
    }

    //const imagePath = movie.image;

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await movie.remove({ session: sess });
      loggedUser.favorite_list.pull(movie);
      await sess.commitTransaction();
    } catch (err) {
      return next(
        new HttpError(`Deleting movie failed, please try again`, 500)
      );
    }

    //fs.unlink(imagePath, (err) => console.log(err));

    res.status(204).json({
      status: 'success',
      data: null,
      message: `Successfully removed from favorite list movie with id ${movie._id}`,
    });
  });

const createOne = () =>
  catchAsync(async (req, res, next) => {
    console.log(req.body, req.userData);

    const createdMovie = new Movie(req.body);

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdMovie.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      console.log(err);
      return next(
        new HttpError('Creating movie failed, please try again later', 500)
      );
    }

    res.status(201).json({ movie: createdMovie });
  });

const getOne = () =>
  catchAsync(async (req, res, next) => {
    let query = Movie.findOne({ id: req.params.id });
    query = query.populate('users');
    const movie = await query;

    if (!movie) {
      const error = new HttpError(`Could not find movie for this id.`, 404);
      return next(error);
    }

    res.status(200).json({ status: 'success', data: movie });
  });

const getAllFavDocs = () =>
  catchAsync(async (req, res, next) => {
    const userId = req.userData.userId;

    let userWithMovies;
    try {
      userWithMovies = await Favorite.findOne({
        user: userId,
        entertainment_type: 'Movie',
      }).populate('entertainment');
    } catch (err) {
      return next(
        new HttpError('Something went wrong, could not find docs.', 500)
      );
    }

    if (!userWithMovies || userWithMovies.length === 0) {
      return next(
        new HttpError('Could not find a document for the provided user id', 404)
      );
    }

    console.log(userWithMovies);

    res.status(200).json({
      favId: userWithMovies._id,
      favMovies: userWithMovies.entertainment,
    });
  });

exports.deleteMovie = deleteOne();
exports.updateMovie = updateOne();
exports.createMovie = createOne();
exports.getMovie = getOne();
exports.getAllFavMovies = getAllFavDocs();
exports.addMovieToFavorites = addToFavorites();
exports.removeMovieFromFavorites = removeFromFavorite();
