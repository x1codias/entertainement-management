const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: String, required: true },
  writer: { type: String, required: true },
  status: {
    type: String,
    enum: ["to-read", "reading", "read"],
    required: true,
    default: "to-read",
  },
  genre: { type: String, required: true },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
