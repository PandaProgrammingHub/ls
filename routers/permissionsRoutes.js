var express = require('express');
var router = express.Router();

// Controllers
var permissionController = require('../controllers/permission');

//Routing for permissions
router.get('/', permissionController.index);

module.exports = router;