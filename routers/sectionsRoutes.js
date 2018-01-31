var express = require('express');
var router = express.Router();

var sectionController = require('../controllers/section');

//Routing for Boards
router.get('/', sectionController.index);
router.post('/', sectionController.create);
router.get('/:id', sectionController.show);
router.put('/:id', sectionController.upsert);
router.delete('/:id', sectionController.destroy);

module.exports = router;