var config = require('../knexfile');
var knex = require('knex')(config);

exports.forAuthorization = function () {
  return knex.from('users as u')
  .leftJoin('user_details as ud', 'u.userdetails_id', 'ud.id')
  .leftJoin('roles as ur', 'u.role_id','ur.id')
  .leftJoin('school_users as su', 'u.id', 'su.user_id')
  .leftJoin('roles as sur', 'su.role_id','sur.id')
  .leftJoin('designations as d', 'su.designation_id','d.id')
  .select([
    'u.id as _id',
    'u.email_id as _emailid',
    'u.mobile as _mobile',
    'u.password as _password',
    'u.status as _status',
    'u.created_at as _createdat',
    'u.role_id as _roleid',
    'ud.name as _name',
    'ud.address as _address',
    'ur.role_name as _rolename',
    'ur.role_type as _roletype',
    'su.id as _su__id',
    'su.school_id as _su__schoolid',
    'su.role_id as _su__roleid',
    'su.designation_id as _su__designationid',
    'd.name as _su__designationname',
    'su.access_till as _su__accesstill',
    'su.device_token as _su__devicetoken',
    'su.device_id as _su__deviceid',
    'su.isLoggedIn as _su__isLoggedIn ',
    'su.added_on as _su__addedon',
    'su.email_id as _su__emailid',
    'su.mobile as _su__mobile',
    'su.status as _su__status',
    'sur.role_name as _su__rolename',
    'sur.role_type as _su__roletype'
  ]);
}

exports.forCommunication = function () {
  return knex.from('users as u')
  .leftJoin('user_details as ud', 'u.userdetails_id', 'ud.id')
  .select([
    'u.id as _id',
    'u.email_id as _emailid',
    'u.mobile as _mobile',
    'ud.name as _name'
  ]);
}