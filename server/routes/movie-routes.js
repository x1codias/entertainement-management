const express = require('express');

const movieController = require('../controllers/movie-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.put('/:id', movieController.updateMovie);

router.post('/', movieController.createMovie);

router.delete('/:id', movieController.deleteMovie);

router.get('/:id', movieController.getMovie);

module.exports = router;
