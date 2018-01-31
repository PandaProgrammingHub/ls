var modelBase = require('../config/bookshelf');

var Learning_Outcomes = modelBase.extend({
  tableName: 'learning_outcomes',
  hasTimestamps: true
});

module.exports = Learning_Outcomes;
