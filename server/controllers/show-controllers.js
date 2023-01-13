const Show = require('../models/show');
const factory = require('../controllers/handler-factory');

exports.getAllShows = factory.getAll(Show);
exports.getShow = factory.getOne(Show, 'Show');
exports.deleteShow = factory.delete(Show, 'Show');
exports.updateShow = factory.update(Show, 'Show');
