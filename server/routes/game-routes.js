const express = require('express');

const gameController = require('../controllers/game-controllers');

const router = express.Router();

router.get('/', gameController.getAllGames);

router.use(checkAuth);

router.post('/', gameController.createGame);

router.patch('/:id/update', gameController.updateGame);

router.delete('/:id', gameController.deleteGame);

router.get('/:id', gameController.getGame);

module.exports = router;
