var express = require('express');
var router = express.Router();

var teacherAppController = require('../../controllers/teacherApp/v1');
var authTeacherUtil = require('../../utils/authTeacherUtils');

//Routing for Subjects
router.get('/status', teacherAppController.status);
router.post('/login', teacherAppController.login);
router.post('/updateContent', authTeacherUtil.teacherIsAuthenticatedForSchool, teacherAppController.updateContent);
router.post('/updateCalender', authTeacherUtil.teacherIsAuthenticatedForSchool, teacherAppController.updateCalender);
router.post('/updateStudentList', authTeacherUtil.teacherIsAuthenticatedForSchool, teacherAppController.updateStudentList);
router.post('/syncData', authTeacherUtil.teacherIsAuthenticatedForSchool, teacherAppController.syncData);

module.exports = router;