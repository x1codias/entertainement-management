const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const progressSchema = new Schema({
  percentage: { type: Number, required: true },
  platform: { type: String, required: true },
  achievments: [
    { type: mongoose.Types.ObjectId, required: true, ref: 'Achievment' },
  ],
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
