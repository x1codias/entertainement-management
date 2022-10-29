const express = require('express');

const gameController = require('../controllers/game-controllers');

const router = express.Router();

router.get('/favorites', gameController.getAllGames);

router.post(
  '/favorite',
  gameController.uploadGameImage,
  gameController.resizeGameImage,
  gameController.createGame
);

router.patch('/:id/status', gameController.updateGame);

router.delete('/:id', gameController.deleteGame);

router.get('/:id', gameController.getGame);

module.exports = router;
