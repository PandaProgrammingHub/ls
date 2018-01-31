var modelBase = require('../config/bookshelf');

var Unit_Tasks = modelBase.extend({
  tableName: 'unit_tasks',
  hasTimestamps: true
});

module.exports = Unit_Tasks;
