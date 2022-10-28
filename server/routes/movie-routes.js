const express = require("express");

const movieController = require("../controllers/movie-controllers");

const router = express.Router();

router.get("/favorites", movieController.getAllMovies);

router.post("/favorite", movieController.createMovie);

router.patch("/:id/status", movieController.updateMovie);

router.delete("/:id", movieController.deleteMovie);

router.get("/:id", movieController.getMovie);

module.exports = router;
