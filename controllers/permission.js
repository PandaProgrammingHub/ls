var Permission = require('../models/permissions');


/**
 * @AUTHOR: Arshe Alam,
 * @Dated: 13 Dec 2017,
 * @PARAMS: req, res, next
 * Returns list of all permissions
 */
exports.index = function (req, res, next) {
    Permission.findAll()
    .then(function (items) {
      return res.status(200).send({success: true, permissions: items.toJSON()});
    });
};
