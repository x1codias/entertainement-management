const express = require("express");

const showController = require("../controllers/show-controllers");

const router = express.Router();

router.get("/favorites", showController.getAllShows);

router.post("/favorite", showController.createShow);

router.patch("/:id/status", showController.updateShow);

router.delete("/:id", showController.deleteShow);

router.get("/:id", showController.getShow);

module.exports = router;
