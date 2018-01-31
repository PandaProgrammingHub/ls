var express = require('express');
var router = express.Router();

var roleController = require('../controllers/role');

//Routing for Boards
router.get('/', roleController.index);
router.post('/', roleController.create);
router.get('/:id', roleController.show);
router.put('/:id', roleController.upsert);
router.delete('/:id', roleController.destroy);

module.exports = router;