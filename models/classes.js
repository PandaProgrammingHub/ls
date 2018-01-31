var modelBase = require('../config/bookshelf');

var ClassSubjects = modelBase.extend({
  tableName: 'class_subjects',
  hasTimestamps: true
});

var Classes = modelBase.extend({
  tableName: 'classes',
  hasTimestamps: true,
  subjects: function() {
    return this.hasMany(ClassSubjects);
  }
});

module.exports = Classes;
