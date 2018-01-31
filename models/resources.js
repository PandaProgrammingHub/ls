var modelBase = require('../config/bookshelf');

var Resource_Type = modelBase.extend({
  tableName: 'resource_type',
  hasTimestamps: true
});

var Resources = modelBase.extend({
  tableName: 'resources',
  hasTimestamps: true,
  ResourceType: function () {
    return this.hasOne(Resource_Type, 'type_id', 'id');
  }
});

module.exports = Resources;
