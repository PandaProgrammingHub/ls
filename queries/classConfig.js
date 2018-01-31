var config = require('../knexfile');
var knex = require('knex')(config);

exports.forSchoolClassGroupedByDivision = function (school_id) {
  return knex.from('school_classes as sc')
  .leftJoin('classes as c', 'c.id', 'sc.class_id')
  .leftJoin('schools as s', 'sc.school_id','s.id')
  .count('sc.division_id as divisions')
  .max('sc.total_student AS total_student')
  .max('s.institutional_kits_count AS institutional_kits_count')
  .max('s.institutional_kits_amount AS institutional_kits_amount')
  .max('s.technology_kits_count AS technology_kits_count')
  .max('s.technology_kits_amount AS technology_kits_amount')
  .max('sc.student_kits AS student_kits')
  .max('sc.assessment AS assessment')
  .max('sc.leadtech AS leadtech')

  .where('sc.school_id', school_id)
  .where('sc.is_enabled', true)
  .groupBy('sc.school_id').groupBy('sc.class_id').groupBy('sc.academic_year_id')
  .select(
    [
      'sc.class_id as class_id'
    ]
  )
}


