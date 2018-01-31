var modelBase = require('../config/bookshelf');

var unitSequence = modelBase.extend({
  tableName: 'unit_sequesnce',
  hasTimestamps: true
});

module.exports = unitSequence;
