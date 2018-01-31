var modelBase = require('../config/bookshelf');
var Schools = require('./school');
var Classes = require('./classes');
var Divisions = require('./divisions');
var SchoolUsers = require('./schoolUsers');
var AcademicYears = require('./academicYears');

var SchoolClasses = modelBase.extend({
  tableName: 'school_classes',
  hasTimestamps: true,
  school: function () {
    return this.belongsTo(Schools, 'school_id', 'id');
  },
  class: function () {
    return this.belongsTo(Classes, 'class_id', 'id');
  },
  division: function () {
    return this.belongsTo(Divisions, 'division_id', 'id');
  },
  classTeacher: function () {
    return this.belongsTo(SchoolUsers, 'class_teacher_id', 'id');
  },
  academic_year: function () {
    return this.belongsTo(AcademicYears, 'academic_year_id', 'id');
  }
});

module.exports = SchoolClasses;
