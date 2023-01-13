const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  gameId: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  image: { type: String, required: false },
  //progress: { type: mongoose.Types.ObjectId, ref: 'Progress' },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
