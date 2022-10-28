const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const HttpError = require("./models/http-error");
const userRoutes = require("./routes/user-routes");
const movieRoutes = require("./routes/movie-routes");
const showRoutes = require("./routes/show-routes");
const gameRoutes = require("./routes/game-routes");
const bookRoutes = require("./routes/book-routes");
const animeRoutes = require("./routes/anime-routes");

dotenv.config({ path: "./config.env" });

const app = express();

app.use(bodyParser.json());

app.use(cors());
/*app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Controll-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});*/

app.options("*", cors);

app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/animes", animeRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/games", gameRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  return next(error);
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@chillplanner.yzamz79.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
