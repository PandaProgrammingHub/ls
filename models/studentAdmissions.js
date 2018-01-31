var modelBase = require('../config/bookshelf');
var Student = require('./students');

var StudentAdmissions = modelBase.extend({
  tableName: 'student_admissions',
  hasTimestamps: true,

  Student: function () {
    return this.hasOne(Student, 'student_id', 'id');
  }

});

module.exports = StudentAdmissions;
