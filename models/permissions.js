var modelBase = require('../config/bookshelf');

var Permissions = modelBase.extend({
  tableName: 'permissions',
  hasTimestamps: true
});

module.exports = Permissions;
