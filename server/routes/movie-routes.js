const express = require('express');

const movieController = require('../controllers/movie-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/', movieController.getAllMovies);

router.use(checkAuth);

router.post('/', movieController.createMovie);

module.exports = router;
