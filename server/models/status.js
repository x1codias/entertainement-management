const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const statusSchema = new Schema({
  entertainment: {
    type: Schema.Types.ObjectId,
    refPath: 'entertainment_type',
  },
  entertainment_type: { type: String, enum: ['Movie', 'Show', 'Book', 'Game'] },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['to_do', 'doing', 'done'],
  },
});

const Status = mongoose.model('Status', statusSchema);

module.exports = Status;
