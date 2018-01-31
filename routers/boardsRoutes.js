var express = require('express');
var router = express.Router();

// Controllers
var boardController = require('../controllers/board');

//Routing for Boards
router.get('/', boardController.index);
router.post('/', boardController.create);
router.get('/:id', boardController.show);
router.put('/:id', boardController.upsert);
router.delete('/:id', boardController.destroy);

module.exports = router;