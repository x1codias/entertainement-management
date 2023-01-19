const express = require('express');
const { check } = require('express-validator');

const userControllers = require('../controllers/user-controllers');
const movieController = require('../controllers/movie-controllers');
const showController = require('../controllers/show-controllers');
const bookController = require('../controllers/book-controllers');
const gameController = require('../controllers/game-controllers');
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

router.get('/:id/favorite/shows', showController.getAllFavoriteShows);

router.get('/:id/favorite/books', bookController.getAllFavoriteBooks);

router.get('/:id/favorite/games', gameController.getAllFavoriteGames);

router.get('/:id/status', movieController.getAllStatusMovies);

router.get('/:id/status/shows', showController.getAllStatusShow);

router.get('/:id/status/books', bookController.getAllStatusBook);

router.get('/:id/status/games', gameController.getAllStatusGame);

router.post('/:id/favorite', movieController.addMovieToFavorites);

router.post('/:id/favorite/shows', showController.addShowToFavorites);

router.post('/:id/favorite/books', bookController.addBookToFavorites);

router.post('/:id/favorite/games', gameController.addGameToFavorites);

router.post('/:id/status', movieController.addMovieToStatus);

router.post('/:uid/shows/status/:id', showController.addShowToStatus);

router.post('/:uid/book/status/:id', bookController.addBookToStatus);

router.post('/:uid/game/status/:id', gameController.addGameToStatus);

router.patch('/:id/favorite/:mid', movieController.removeMovieFromFavorites);

router.patch(
  '/:uid/favorite/shows/:id',
  showController.removeShowFromFavorites
);

router.patch(
  '/:uid/favorite/books/:id',
  bookController.removeBookFromFavorites
);

router.patch(
  '/:uid/favorite/games/:id',
  gameController.removeGameFromFavorites
);

router.patch('/:id/status/:mid', movieController.updateMovieStatus);

router.patch('/:uid/shows/status/:id', showController.updateShowStatus);

router.patch('/:uid/books/status/:id', bookController.updateBookStatus);

router.patch('/:uid/games/status/:id', gameController.updateGameStatus);

module.exports = router;
