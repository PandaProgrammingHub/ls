var express = require('express');
var router = express.Router();

var spController = require('../controllers/studentPromotions');

router.get('/', spController.index);
router.put('/', spController.edit);

module.exports = router;