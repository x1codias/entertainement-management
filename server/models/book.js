const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  bookId: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  image: { type: String, required: false },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
