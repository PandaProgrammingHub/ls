var express = require('express');
var router = express.Router();

var communicationTemplateController = require('../controllers/communicationTemplate');

//Routing for Boards
router.get('/', communicationTemplateController.index);
router.post('/', communicationTemplateController.create);
router.get('/:id', communicationTemplateController.show);
router.put('/:id', communicationTemplateController.edit);

module.exports = router;