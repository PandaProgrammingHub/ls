var express = require('express');
var router = express.Router();

// Controllers
var pincodeController = require('../controllers/pincode');

//Routing for Schools
router.get('/', pincodeController.getPincodeDetails);
router.post('/', pincodeController.addPincode);
router.put('/:id', pincodeController.editPincode);

module.exports = router;