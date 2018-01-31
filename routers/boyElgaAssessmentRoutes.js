var express = require('express');
var router = express.Router();

var boyElgaAssessmentController = require('../controllers/boyElgaAssessment');

//Routing for Boards
router.get('/', boyElgaAssessmentController.index);
router.put('/:student_admission_id', boyElgaAssessmentController.edit);
router.delete('/:student_admission_id', boyElgaAssessmentController.destroy);

module.exports = router;