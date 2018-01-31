var modelBase = require('../config/bookshelf');

var Components = modelBase.extend({
  tableName: 'components',
  hasTimestamps: true
});

module.exports = Components;
