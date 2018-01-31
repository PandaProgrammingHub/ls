var express = require('express');
var router = express.Router();

// Controllers
var academicYearsController = require('../controllers/academicYears');

//Routing for Boards
router.get('/', academicYearsController.index);
router.post('/', academicYearsController.create);
router.get('/:id', academicYearsController.show);
router.put('/:id', academicYearsController.upsert);
router.delete('/:id', academicYearsController.destroy);

module.exports = router;