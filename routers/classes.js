var express = require('express');
var router = express.Router();

var classController = require('../controllers/class');

//Routing for Boards
router.get('/', classController.index);
router.post('/', classController.create);
router.get('/:id', classController.show);
router.put('/:id', classController.upsert);
router.delete('/:id', classController.destroy);

module.exports = router;