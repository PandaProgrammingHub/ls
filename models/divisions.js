var modelBase = require('../config/bookshelf');

var Divisions = modelBase.extend({
  tableName: 'divisions',
  hasTimestamps: true
});

module.exports = Divisions;
