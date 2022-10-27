const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const seasonSchema = new Schema({
  season: [{ type: Number, required: true }],
  episodes: [{ type: String, required: true }],
});

const Season = mongoose.model("Season", seasonSchema);

module.exports = Season;
