var express = require('express');
var router = express.Router();

var sdController = require('../controllers/studentDivision');

router.get('/', sdController.index);
router.put('/:id', sdController.edit);

module.exports = router;