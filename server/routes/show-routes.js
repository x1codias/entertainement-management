const express = require('express');

const showController = require('../controllers/show-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/', showController.getAllShows);

router.use(checkAuth);

router.post('/', showController.createShow);

router.patch('/:id/update', showController.updateShow);

router.delete('/:id', showController.deleteShow);

router.get('/:id', showController.getShow);

module.exports = router;
