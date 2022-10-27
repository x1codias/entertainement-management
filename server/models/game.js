const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: String, required: true },
  crew: { type: mongoose.Types.ObjectId, required: true, ref: "Crew" },
  status: {
    type: String,
    enum: ["to-play", "playing", "played"],
    required: true,
    default: "to-play",
  },
  genre: { type: String, required: true },
  studio: { type: String, required: true },
  progress: { type: mongoose.Types.ObjectId, ref: "Progress" },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
