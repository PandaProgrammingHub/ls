var modelBase = require('../config/bookshelf');


var Units = modelBase.extend({
  tableName: 'units',
  hasTimestamps: true
});

module.exports = Units;
