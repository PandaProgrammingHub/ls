var config = require('../knexfile');
var knex = require('knex')(config);
var configmysql = require('../knexfileGamma');
var knexmysql = require('knex')(configmysql);

exports.forTASClassDivisions = function(academic_year_id, school_user_id, school_id){
  return knex.from('school_classes as sc')
    .innerJoin('class_master as c', 'sc.class_id', 'c.id')
    .innerJoin('division_id as d', 'sc.', 'd.id')
    .select([
      'sc.id as _id',
      'sc.school_id as _schoolid',
      'sc.class_id as _classid',
      'sc.division_id as _divisionid',
      'c.id as _class_id',
      'c.name as _classs_name',
      'c.class_type as _class_type',
      'd.id as _divison'
    ])
}