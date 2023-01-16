const express = require('express');
const { check } = require('express-validator');

const userControllers = require('../controllers/user-controllers');
const movieController = require('../controllers/movie-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post(
  '/signup',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  //userControllers.uploadUserImage,
  //userControllers.resizeUserImage,
  userControllers.signup
);

router.post('/login', userControllers.login);

router.use(checkAuth);

router.get('/:id/favorite', movieController.getAllFavMovies);

router.get('/:id/status', movieController.getAllStatusMovies);

router.post('/:id/favorite', movieController.addMovieToFavorites);

router.post('/:id/status', movieController.addMovieToStatus);

router.patch('/:id/favorite/:mid', movieController.removeMovieFromFavorites);

router.patch('/:id/status/:mid', movieController.updateMovieStatus);

module.exports = router;
