var modelBase = require('../config/bookshelf');

var SchoolStaus = modelBase.extend({
  tableName: 'school_status',
  hasTimestamps: true
});

module.exports = SchoolStaus;
