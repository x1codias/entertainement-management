const Show = require('../models/show');
const factory = require('../controllers/handler-factory');

exports.getAllShows = factory.getAll(Show);
exports.getShow = factory.getOne(Show, 'Show');
exports.deleteShow = factory.delete(Show, 'Show');
exports.updateShow = factory.update(Show, 'Show');
exports.getAllFavoriteShows = factory.getAllFavoriteDocs('Show');
exports.addShowToFavorites = factory.addDocToFavorites(Show, 'showId', 'Show');
exports.removeShowFromFavorites = factory.removeDocFromFavorites(
  Show,
  'showId'
);
exports.getAllStatusShow = factory.getAllStatusDocs('Show');
exports.addShowToStatus = factory.addDocToStatus(Show, 'showId', 'Show');
exports.updateShowStatus = factory.updateStatus(Show, 'showId');
