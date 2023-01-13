const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const episodeSchema = new Schema({
  season: { type: Number, required: true },
  title: { type: String },
  description: { type: String },
  seen: { type: Boolean, default: false },
});

const Episode = mongoose.model('Episode', episodeSchema);

module.exports = Episode;
