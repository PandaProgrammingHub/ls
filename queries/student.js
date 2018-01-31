var config = require('../knexfile');
var knex = require('knex')(config);

exports.forAdmin = function () {
  return knex.from('students as s')
  .leftJoin('student_admissions as sa', 's.id', 'sa.student_id')
  .leftJoin('schools as sc', 'sa.school_id','sc.id')
  .leftJoin('classes as cr', 'cr.id', 'sa.regular_class_id')
  .leftJoin('divisions as dr', 'dr.id', 'sa.regular_division_id')
  .leftJoin('classes as ces', 'ces.id', 'sa.elgastart_class_id')
  .leftJoin('divisions as des', 'des.id', 'sa.elgastart_division_id')
  .leftJoin('classes as cee', 'cee.id', 'sa.elgaend_class_id')
  .leftJoin('divisions as dee', 'dee.id', 'sa.elgaend_division_id')
  .leftJoin('pincode as p', 's.pincode_id', 'p.id')
  .select(
    [
      's.id as _id', 
      's.first_name as _firstname', 
      's.middle_name as _middlename',
      's.last_name as _lastname',
      's.date_of_birth as _dateofbirth',
      's.gender as _gender',
      's.blood_group as _bloodgroup',
      's.address_line_1 as _addressline1',
      's.address_line_2 as _addressline2',
      's.address_line_3 as _addressline3',
      's.pincode_id as _pincodeid',
      'p.code as _pincode',
      'p.state as _state',
      'p.city as _city',
      's.fathers_name as _fathersname',
      's.fathers_phone as _fathersphone',
      's.fathers_email as _fathersemail',
      's.fathers_occuption as _fathersoccuption',
      's.mothers_name as _mothersname',
      's.mothers_phone as _mothersphone',
      's.mothers_email as _mothersemail',
      's.mothers_occupation as _mothersoccupation',
      's.guardians_name as _guardiansname',
      's.guardians_phone as _guardiansphone',
      's.guardians_email as _guardiansemail',
      's.guardians_occupation as _guardiansoccupation',
      's.guardians_relationship as _guardiansrelationship',
      'sa.id as _sa__id',
      'sa.student_id as _sa__studentid',
      'sa.admission_date as _sa__admissiondate',
      'sa.regular_class_id as _sa__regularclassid',
      'cr.name as _sa__regularclassname',
      'sa.regular_division_id as _sa__regulardivisionid',
      'dr.name as _sa__regulardivisionname',
      'sa.elgastart_class_id as _sa__elgastartclassid',
      'ces.name as _sa__elgastartclassname',
      'sa.elgastart_division_id as _sa__elgastartdivisionid',
      'des.name as _sa__elgastartdivisionname',
      'sa.status as _sa__status',
      'sa.academic_year_id as _sa__academicyearid',
      'sa.school_id as _sa__schoolid',
      'sc.name as _sa__schoolname',
      'sa.elgaend_class_id as _sa__elgaendclassid',
      'cee.name as _sa__elgaendclassname',
      'sa.elgaend_division_id as _sa__elgaenddivisionid',
      'dee.name as _sa__elgaenddivisionname'
    ]
  );
}


