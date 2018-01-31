var modelBase = require('../config/bookshelf');

var Day_Plan = modelBase.extend({
  tableName: 'day_plan',
  hasTimestamps: true
});

module.exports = Day_Plan;
