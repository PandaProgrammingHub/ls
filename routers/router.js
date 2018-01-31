var express = require('express');
var router = express.Router();

// Controllers
var userController = require('../controllers/user');
var contactController = require('../controllers/contact');
var authController = require('../controllers/auth');

router.post('/contact', contactController.contactPost);
router.put('/account', userController.ensureAuthenticated, userController.accountPut);
router.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
router.post('/signup', authController.userSignup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/verifyOtp', authController.verifyOTP);
router.post('/resetPassword', authController.forgotPasswordVerify);
router.post('/reset/:token', userController.resetPost);
router.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);

module.exports = router;