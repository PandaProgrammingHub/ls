var express = require('express');
var router = express.Router();

// Controllers
var designationsController = require('../controllers/designations');

//Routing for Schools
router.get('/', designationsController.getAllDesignations);
router.post('/', designationsController.addDesignation);
router.put('/:id', designationsController.editDesignation);
router.get('/:id', designationsController.show);

module.exports = router;