const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const showSchema = new Schema({
  showId: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  image: { type: String, required: false },
  //seasons: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Season' }],
});

const Show = mongoose.model('Show', showSchema);

module.exports = Show;
