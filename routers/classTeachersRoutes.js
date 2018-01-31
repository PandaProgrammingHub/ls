var express = require('express');
var router = express.Router();

// Controllers
var classTeachersController = require('../controllers/classTeachers');

//Routing for Schools
router.get('/', departmentsController.getAllDepartments);
router.post('/', departmentsController.addDepartment);
router.put('/:id', departmentsController.editDepartment);

module.exports = router;