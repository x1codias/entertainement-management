const Movie = require('../models/movie');
const factory = require('../controllers/handler-factory');

exports.getAllMovies = factory.getAll(Movie);
exports.getMovie = factory.getOne(Movie, 'crew', 'Movie');
exports.createMovie = factory.create(Movie);
exports.deleteMovie = factory.delete(Movie, 'Movie');
exports.updateMovie = factory.update(Movie, 'Movie');
exports.uploadMovieImage = factory.upload;
exports.resizeMovieImage = factory.resizeImage('movie');
