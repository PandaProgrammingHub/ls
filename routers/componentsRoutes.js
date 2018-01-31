var express = require('express');
var router = express.Router();

var componentController = require('../controllers/component');

//Routing for Boards
router.get('/', componentController.index);
router.post('/', componentController.create);
router.get('/:id', componentController.show);
router.put('/:id', componentController.upsert);
router.delete('/:id', componentController.destroy);

module.exports = router;