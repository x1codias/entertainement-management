const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  movieId: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  image: { type: String, required: false },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
