var express = require('express');
var router = express.Router();

// Controllers
var departmentsController = require('../controllers/department');

//Routing for Schools
router.get('/', departmentsController.getAllDepartments);
router.post('/', departmentsController.addDepartment);
router.put('/:id', departmentsController.editDepartment);
router.get('/:id', departmentsController.show);

module.exports = router;