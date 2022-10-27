const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const crewSchema = new Schema({
  cast: [{ type: String, required: true }],
  director: { type: String, required: true },
  writers: [{ type: String, required: true }],
});

const Crew = mongoose.model("Crew", crewSchema);

module.exports = Crew;
