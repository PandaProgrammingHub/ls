var express = require('express');
var router = express.Router();

// Controllers
var schoolPaymentController = require('../controllers/schoolPayments');

//Routing for Schools
router.put('/:id', schoolPaymentController.updateSchoolPayment);
router.get('/:id', schoolPaymentController.getPaymentDetails);
router.get('/:id/download', schoolPaymentController.downloadPaymentDetails);

module.exports = router;