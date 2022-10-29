const express = require('express');

const bookController = require('../controllers/book-controllers');

const router = express.Router();

router.get('/favorites', bookController.getAllBooks);

router.post(
  '/favorite',
  bookController.uploadBookImage,
  bookController.resizeBookImage,
  bookController.createBook
);

router.patch('/:id/status', bookController.updateBook);

router.delete('/:id', bookController.deleteBook);

router.get('/:id', bookController.getBook);

module.exports = router;
