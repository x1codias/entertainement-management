const Game = require('../models/game');
const factory = require('../controllers/handler-factory');

exports.getAllGames = factory.getAll(Game);
exports.getGame = factory.getOne(Game, 'Game');
exports.deleteGame = factory.delete(Game, 'Game');
exports.updateGame = factory.update(Game, 'Game');
exports.createGame = factory.createOne(Game);
exports.getAllFavoriteGames = factory.getAllFavoriteDocs('Game');
exports.addGameToFavorites = factory.addDocToFavorites(Game, 'gameId', 'Game');
exports.removeGameFromFavorites = factory.removeDocFromFavorites(
  Game,
  'gameId',
  'Game'
);
exports.getAllStatusGame = factory.getAllStatusDocs('Game');
exports.addGameToStatus = factory.addDocToStatus(Game, 'gameId', 'Game');
exports.updateGameStatus = factory.updateStatus(Game, 'gameId', 'Game');
