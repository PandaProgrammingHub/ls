var modelBase = require('../config/bookshelf');
var StudentAdmissions = require('./studentAdmissions');

var BoyElgaAssessment = modelBase.extend({
  tableName: 'boy_elga_assessments',
  hasTimestamps: true,
  
  student_details: function(){
    return this.belongsTo(StudentAdmissions, 'student_admission_id', 'id');
  }
});

module.exports = BoyElgaAssessment;
