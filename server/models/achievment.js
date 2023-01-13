const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const achievmentSchema = new Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  done: { type: Boolean, default: false },
});

const Achievment = mongoose.model('Achievment', achievmentSchema);

module.exports = Achievment;
