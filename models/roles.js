var modelBase = require('../config/bookshelf');

var Roles = modelBase.extend({
  tableName: 'roles',
  hasTimestamps: true
});

module.exports = Roles;
