var express = require('express');
var router = express.Router();

var cttController = require('../controllers/classTimeTable');

router.get('/:id', cttController.download);
router.post('/:id', cttController.upload);

module.exports = router;