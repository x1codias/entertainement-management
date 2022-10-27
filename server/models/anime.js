const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const animeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: String, required: true },
  crew: { type: mongoose.Types.ObjectId, required: true, ref: "Crew" },
  status: {
    type: String,
    enum: ["to-watch", "watching", "watched"],
    required: true,
    default: "to-watch",
  },
  genre: { type: String, required: true },
  studio: { type: String, required: true },
  seasons: [{ type: mongoose.Types.ObjectId, ref: "Season" }],
});

const Anime = mongoose.model("Anime", animeSchema);

module.exports = Anime;
