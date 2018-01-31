var modelBase = require('../config/bookshelf');

var Versions = modelBase.extend({
  tableName: 'versions',
  hasTimestamps: true
});

module.exports = Versions;
