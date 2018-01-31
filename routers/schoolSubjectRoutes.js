var express = require('express');
var router = express.Router();

// Controllers
var schoolSubjectConfigController = require('../controllers/schoolSubjectConfig');

//Routing for School Subject Config
router.post('/', schoolSubjectConfigController.addSchoolSubjectConfig);
router.get('/', schoolSubjectConfigController.getSchoolSubjectConfig);
router.put('/:id', schoolSubjectConfigController.editSchoolSubject);

module.exports = router;