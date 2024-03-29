const express = require('express');

const bookController = require('../controllers/book-controllers');

const router = express.Router();

router.get('/', bookController.getAllBooks);

router.use(checkAuth);

router.post('/', bookController.createBook);

router.patch('/:id/update', bookController.updateBook);

router.delete('/:id', bookController.deleteBook);

router.get('/:id', bookController.getBook);

module.exports = router;
