const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const statusSchema = new Schema({
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
  status: {
    type: String,
    enum: ['to_do', 'doing', 'done'],
  },
});

const Status = mongoose.model('Status', statusSchema);

module.exports = Status;
