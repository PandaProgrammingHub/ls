var modelBase = require('../config/bookshelf');

var Pincode = modelBase.extend({
  tableName: 'pincode',
  hasTimestamps: true
});

module.exports = Pincode;
