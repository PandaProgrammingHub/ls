var express = require('express');
var router = express.Router();
router.use(require('express-promise')());

// Controllers
var schoolController = require('../controllers/school');
var schoolClassController = require('../controllers/schools/schoolClass');
var schoolUsersController = require('../controllers/schools/schoolUsers');
var schoolProfileController = require('../controllers/schools/schoolProfile');
var schoolClassDivisionController = require('../controllers/schools/schoolClassDivisions');
var studentController = require('../controllers/student');
var schoolClassConfigController = require('../controllers/schoolClassConfig');
var authUtil = require('../utils/authUtils');


//Routing for Schools
router.post('/', schoolController.addSchool);

router.get('/salesList', schoolController.salesList);
router.get('/userList', schoolController.userList);
router.put('/:id/deactivate', schoolController.deactivate);
router.put('/:id/activate', schoolController.activate);
router.get('/:id', schoolController.getInfo);
router.put('/:id', schoolController.updateSchool);

router.get('/:id/documents', schoolController.getDocuments);
router.post('/:id/documents', schoolController.addDocuments);

router.post('/:id/payments', schoolController.addPayments);
router.get('/:id/payments', schoolController.getPayments);

router.put('/:id/payments', schoolController.editPayments);
router.put('/:id/updatePaymentStatus', schoolController.updatePaymentStatus);

router.get('/:id/users', schoolController.getSchoolUsers);

//Routes for School Classes
router.get('/:school_id/schoolclasses/', schoolClassController.getAllSchoolClasses);
router.put('/:school_id/schoolclasses/:id', schoolClassController.editSchoolClass);

//Routes for School Users
router.post('/:school_id/users/upload', schoolUsersController.uploadSchoolUsers);
router.get('/:school_id/users/:id', schoolUsersController.getSchoolUserDetails);
router.post('/:school_id/users/', schoolUsersController.addSchoolUsers);
router.put('/:school_id/users/:id', schoolUsersController.editSchoolUsers);

//Routes for Students
router.get('/:school_id/students', authUtil.isAuthenticated, authUtil.hasAccessToSchool, studentController.index);
router.post('/:school_id/students', authUtil.isAuthenticated, authUtil.hasAccessToSchool, studentController.create);
router.get('/:school_id/students/:id', authUtil.isAuthenticated, authUtil.hasAccessToSchool, studentController.show);
router.put('/:school_id/students/:id', authUtil.isAuthenticated, authUtil.hasAccessToSchool, studentController.edit);
router.delete('/:school_id/students/:id', authUtil.isAuthenticated, authUtil.hasAccessToSchool, studentController.destroy);
router.post('/:school_id/students/export/StudentList.xlsx', authUtil.isAuthenticated, authUtil.hasAccessToSchool, studentController.export);
router.post('/:school_id/students/import', authUtil.isAuthenticated, authUtil.hasAccessToSchool, studentController.import);

//Routing for School Class Config
router.post('/:school_id/schoolClassConfig', schoolClassConfigController.addSchoolClassConfig);
router.get('/:school_id/schoolClassConfig', schoolClassConfigController.getSchoolClassConfig);

//Route for School Profile
router.put('/:id/profile/', schoolProfileController.editProfile);

//Route for School Agreement Download
router.get('/:school_id/agreementdownload', schoolController.downloadAgreementDocument);

//Route for School Class Divisions
router.get('/:school_id/classesanddivisions', schoolClassDivisionController.index);


module.exports = router;