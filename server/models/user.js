const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 6 },
  //imageUrl: { type: String, required: true },
  favorite_list: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Favorite',
    },
  ],
  status_list: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Status',
    },
  ],
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;
