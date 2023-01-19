const Book = require('../models/book');
const factory = require('../controllers/handler-factory');

exports.getAllBooks = factory.getAll(Book);
exports.getBook = factory.getOne(Book, 'Book');
exports.deleteBook = factory.delete(Book, 'Book');
exports.updateBook = factory.update(Book, 'Book');
exports.createBook = factory.createOne(Book);
exports.getAllFavoriteBooks = factory.getAllFavoriteDocs('Book');
exports.addBookToFavorites = factory.addDocToFavorites(Book, 'bookId', 'Book');
exports.removeBookFromFavorites = factory.removeDocFromFavorites(
  Book,
  'bookId',
  'Book'
);
exports.getAllStatusBook = factory.getAllStatusDocs('Book');
exports.addBookToStatus = factory.addDocToStatus(Book, 'bookId', 'Book');
exports.updateBookStatus = factory.updateStatus(Book, 'bookId', 'Book');
