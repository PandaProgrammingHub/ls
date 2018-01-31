var modelBase = require('../config/bookshelf');

var SchoolTypes = modelBase.extend({
  tableName: 'school_type',
  hasTimestamps: true
});

module.exports = SchoolTypes;
