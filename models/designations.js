var modelBase = require('../config/bookshelf');

var Designation = modelBase.extend({
  tableName: 'designations',
  hasTimestamps: true,
  
});

module.exports = Designation;
