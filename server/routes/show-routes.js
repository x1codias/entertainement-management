const express = require('express');

const showController = require('../controllers/show-controllers');

const router = express.Router();

router.get('/', showController.getAllShows);

router.patch('/:id/update', showController.updateShow);

router.delete('/:id', showController.deleteShow);

router.get('/:id', showController.getShow);

module.exports = router;
