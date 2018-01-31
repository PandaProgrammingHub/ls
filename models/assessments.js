var modelBase = require('../config/bookshelf');

var Assessment_Type = modelBase.extend({
  tableName: 'assessment_type',
  hasTimestamps: true
});

var Assessments = modelBase.extend({
  tableName: 'assessments',
  hasTimestamps: true,
  AssessmentType: function () {
    return this.hasOne(Assessment_Type, 'type_id', 'id');
  }
});

module.exports = Assessments;
