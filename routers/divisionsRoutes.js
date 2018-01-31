var express = require('express');
var router = express.Router();

var divisionController = require('../controllers/division');

//Routing for Boards
router.get('/', divisionController.index);
router.post('/', divisionController.create);
router.get('/:id', divisionController.show);
router.put('/:id', divisionController.upsert);
router.delete('/:id', divisionController.destroy);

module.exports = router;