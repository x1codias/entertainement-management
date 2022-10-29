const Game = require('../models/game');
const factory = require('../controllers/handler-factory');

exports.getAllGames = factory.getAll(Game);
exports.getGame = factory.getOne(Game, 'crew progress', 'Game');
exports.createGame = factory.create(Game);
exports.deleteGame = factory.delete(Game, 'Game');
exports.updateGame = factory.update(Game, 'Game');
exports.uploadGameImage = factory.upload;
exports.resizeGameImage = factory.resizeImage('game');
