var express = require('express');
var router = express.Router();

// Controllers
var schoolTypeController = require('../controllers/schoolTypes');

//Routing for Boards
router.get('/', schoolTypeController.index);
router.post('/', schoolTypeController.create);
router.get('/:id', schoolTypeController.show);
router.put('/:id', schoolTypeController.upsert);
router.delete('/:id', schoolTypeController.destroy);

module.exports = router;