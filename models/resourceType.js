var modelBase = require('../config/bookshelf');

var ResourceType = modelBase.extend({
  tableName: 'resource_type',
  hasTimestamps: true
});

module.exports = ResourceType;
