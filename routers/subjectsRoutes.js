var express = require('express');
var router = express.Router();

var subjectController = require('../controllers/subjects');

//Routing for Subjects
router.get('/', subjectController.index);
router.post('/', subjectController.create);
router.get('/:id', subjectController.show);
router.put('/:id', subjectController.upsert);
router.delete('/:id', subjectController.destroy);

module.exports = router;