var express = require('express');
var router = express.Router();

var clusterController = require('../controllers/cluster');

//Routing for Boards
router.get('/', clusterController.index);
router.post('/', clusterController.create);
router.get('/:id', clusterController.show);
router.put('/:id', clusterController.upsert);
router.delete('/:id', clusterController.destroy);

module.exports = router;