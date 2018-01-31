var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
router.use(fileUpload());
router.use(require('express-promise')());

var studentController = require('../controllers/student');
var authUtil = require('../utils/authUtils');

//Routing for Boards
// router.get('/', studentController.index);
router.get('/', authUtil.hasAccessToSchool, studentController.index);
router.post('/', authUtil.hasAccessToSchool, studentController.create);
router.get('/:id', authUtil.hasAccessToSchool, studentController.show);
router.put('/:id', authUtil.hasAccessToSchool, studentController.edit);
router.delete('/:id', authUtil.hasAccessToSchool, studentController.destroy);
router.post('/export/:id/StudentList.xlsx', authUtil.hasAccessToSchool, studentController.export);
router.post('/import/:id', authUtil.hasAccessToSchool, studentController.import);

module.exports = router;