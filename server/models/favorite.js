const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
  entertainment: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'entertainment_type',
    },
  ],
  entertainment_type: {
    type: String,
    required: true,
    enum: ['Movie', 'Show', 'Book', 'Game'],
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
