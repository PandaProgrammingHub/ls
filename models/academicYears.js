var modelBase = require('../config/bookshelf');

var AcademicYears = modelBase.extend({
  tableName: 'academic_years',
  hasTimestamps: true
});

module.exports = AcademicYears;
