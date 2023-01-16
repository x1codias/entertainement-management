const express = require('express');

const movieController = require('../controllers/movie-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/', movieController.getAllMovies);

router.use(checkAuth);

router.put('/:id', movieController.updateMovie);

router.post('/', movieController.createMovie);

router.delete('/:id', movieController.deleteMovie);

module.exports = router;
