const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const progressSchema = new Schema({
  percentage: { type: Number, required: true },
  achievments: [{ type: String, required: true }],
});

const Progress = mongoose.model("Progress", progressSchema);

module.exports = Progress;
