const Book = require('../models/book');
const factory = require('../controllers/handler-factory');

exports.getAllBooks = factory.getAll(Book);
exports.getBook = factory.getOne(Book, 'Book');
exports.deleteBook = factory.delete(Book, 'Book');
exports.updateBook = factory.update(Book, 'Book');
