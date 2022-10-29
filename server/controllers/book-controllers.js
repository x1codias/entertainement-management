const Book = require('../models/book');
const factory = require('../controllers/handler-factory');

exports.getAllBooks = factory.getAll(Book);
exports.getBook = factory.getOne(Book, 'Book');
exports.createBook = factory.create(Book);
exports.deleteBook = factory.delete(Book, 'Book');
exports.updateBook = factory.update(Book, 'Book');
exports.uploadBookImage = factory.upload;
exports.resizeBookImage = factory.resizeImage('book');
