var modelBase = require('../config/bookshelf');
var StudentAdmissions = require('./studentAdmissions');

var Students = modelBase.extend({
  tableName: 'students',
  hasTimestamps: true,

  StudentAdmissions: function () {
    return this.hasMany(StudentAdmissions);
  }
});

// var Students = modelBase.extend({
//   tableName: 'students',
//   hasTimestamps: true
// });

module.exports = Students;
