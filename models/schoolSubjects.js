var modelBase = require('../config/bookshelf');
var Schools = require('./school');
var Subjects = require('./subjects');
var Classes = require('./classes');
var Divisions = require('./divisions');
var SchoolUsers = require('./schoolUsers');
var AcademicYears = require('./academicYears');
var UnitSequence = require('./unitSequence');

var SchoolSubjects = modelBase.extend({
  tableName: 'school_subjects',
  hasTimestamps: true,

  subject: function () {
    return this.belongsTo(Subjects, 'subject_id', 'id');
  },
  class: function () {
    return this.belongsTo(Classes, 'class_id', 'id');
  },
  division: function () {
    return this.belongsTo(Divisions, 'division_id', 'id');
  },
  subject_teacher: function () {
    return this.belongsTo(SchoolUsers, 'subject_teacher_id', 'id');
  },
  academic_year: function () {
    return this.belongsTo(AcademicYears, 'academic_year_id', 'id');
  },
  unit_sequence: function () {
    return this.belongsTo(UnitSequence, 'unit_sequence_id', 'id');
  }
});

module.exports = SchoolSubjects;
