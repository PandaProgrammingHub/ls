var modelBase = require('../config/bookshelf');

var Clusters = modelBase.extend({
  tableName: 'clusters',
  hasTimestamps: true
});

module.exports = Clusters;
