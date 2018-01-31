var express = require('express');
var router = express.Router();

var resourceTypeController = require('../controllers/resourceType');

//Routing for Boards
router.get('/', resourceTypeController.index);
router.post('/', resourceTypeController.create);
router.get('/:id', resourceTypeController.show);
router.put('/:id', resourceTypeController.upsert);
router.delete('/:id', resourceTypeController.destroy);

module.exports = router;