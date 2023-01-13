const Game = require('../models/game');
const factory = require('../controllers/handler-factory');

exports.getAllGames = factory.getAll(Game);
exports.getGame = factory.getOne(Game, 'progress', 'Game');
exports.deleteGame = factory.delete(Game, 'Game');
exports.updateGame = factory.update(Game, 'Game');
