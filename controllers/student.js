var config = require('../knexfile');
var knex = require('knex')(config);
var knexnest = require('knexnest');
var Student = require('../models/students');
var StudentAdmission = require('../models/studentAdmissions');
var XLSX = require('xlsx');
var formidable = require('formidable');
var Class = require('../models/classes');
var Division = require('../models/divisions');
var modelUtils = require('../utils/modelUtils');
var studentQueries = require('../queries/student')
var async = require('async');

/**
 * @AUTHOR: Anuj Kothari,
 * @Dated: 27 Dec 2017,
 * @PARAMS: req, res, next
 * Get the schoolid
 *  if schoolid is blank, null or nan - respond error
 *  The the page number
 *  Get the list of students from that school as per page
 *  Return the information
 */
exports.index = function (req, res, next) {
  
  var page = 1;
  var pageSize = 10;

  if (req.query.page) {
    page = req.query.page;
  }

  var query = studentQueries.forAdmin();

  query.where('sa.school_id',req.params.school_id)
  
    if (req.query.student_name) {
      query.where('s.first_name', 'ilike', '%' + req.query.student_name + '%');
    }

    if (req.query.regular_class_id) {
      query.where('sa.regular_class_id', req.query.regular_class_id);
    }

    if (req.query.regular_division_id) {
      query.where('sa.regular_division_id', req.query.regular_division_id);
    }

    if (req.query.elgastart_class_id) {
      query.where('sa.elgastart_class_id', req.query.elgastart_class_id);
    }

    if (req.query.elgastart_division_id) {
      query.where('sa.elgastart_division_id', req.query.elgastart_division_id);
    }

  query.select(knex.raw('count(*) OVER() AS _fullcount'));
  query.limit(pageSize).offset(pageSize*(page-1));

  knexnest(query).then(function(results) {
    query = null;
    res.send({success: true, students: results});
  })
  .then(null, function(err) {
    query = null;
    req.log.info(err);
    res.status(500).send({success: false, msg: err});
  });  
};

/**
 * @AUTHOR: Anuj Kothari,
 * @Dated: 28 Dec 2017,
 * @PARAMS: req, res, next
 * Check for required parameters.[Firstname, lastname]
 * Add student
 *  get studentid
 *  add student admission
 */
exports.create = function (req, res, next) {
  req.assert('firstname', 'Student name cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  Student.create({
    first_name : req.body.firstname,
    middle_name : req.body.middlename,
    last_name : req.body.lastname,
    date_of_birth : req.body.dateofbirth,
    gender : req.body.gender,
    blood_group : req.body.bloodgroup,
    address_line_1 : req.body.addressline1,
    address_line_2 : req.body.addressline2,
    address_line_3 : req.body.addressline3,
    pincode_id : req.body.pincodeid,
    fathers_name : req.body.fathersname,
    fathers_phone : req.body.fathersphone,
    fathers_email : req.body.fathersemail,
    fathers_occuption : req.body.fathersoccuption,
    mothers_name : req.body.mothersname,
    mothers_phone : req.body.mothersphone,
    mothers_email : req.body.mothersemail,
    mothers_occupation : req.body.mothersoccupation,
    guardians_name : req.body.guardiansname,
    guardians_phone : req.body.guardiansphone,
    guardians_email : req.body.guardiansemail,
    guardians_occupation : req.body.guardiansoccupation,
    guardians_relationship : req.body.guardiansrelationship
  })
  .then(function (student) {
    //add student admission
    StudentAdmission.create({
      student_id : student.id,
      admission_date : req.body.sa[0].admissiondate,
      school_id : req.body.sa[0].schoolid,
      regular_class_id : req.body.sa[0].regularclassid,
      regular_division_id : req.body.sa[0].regulardivisionid,
      elgastart_class_id : req.body.sa[0].elgastartclassid,
      elgastart_division_id : req.body.sa[0].elgastartdivisionid,
      status : req.body.sa[0].status,
      academic_year_id : req.body.sa[0].academicyearid, 
      elgaend_class_id : req.body.sa[0].elgaendclassid,
      elgaend_division_id : req.body.sa[0].elgaenddivisionid
    })
    .then(function (studentadmission){
      return res.status(200).send({success: true, Student: student.id});
    })
    .then(null, function(err) {
      console.log(req.body.sa[0].academicyearid);
      res.status(500).send({success: false, msg: err});
    });
  })
  .then(null, function(err) {
    res.status(500).send({success: false, msg: err});
  });
};

/**
 * @AUTHOR: Anuj Kothari,
 * @Dated: 29 Dec 2017,
 * @PARAMS: req, res, next
 * if name and id is blank respond error
 * if student doesnt exist
 * if user doesnt have access to this student - repond 401 error
 * if exists
 *   respond error
 * else
 *   update the Student name
 */
exports.edit = function (req, res, next) {
  req.assert('id', 'Invalid Request.').notEmpty();
  req.assert('firstname', 'Student name cannot be blank.').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  Student.findOne({id: req.params.id}, {require: false})
    .then(function (student) {
      if (!student) {
        return res.status(400).send({success: false, msg: 'Invalid Request'});
      }
      student.set({
        first_name : req.body.firstname,
        middle_name : req.body.middlename,
        last_name : req.body.lastname,
        date_of_birth : req.body.dateofbirth,
        gender : req.body.gender,
        blood_group : req.body.bloodgroup,
        address_line_1 : req.body.addressline1,
        address_line_2 : req.body.addressline2,
        address_line_3 : req.body.addressline3,
        pincode_id : req.body.pincodeid,
        fathers_name : req.body.fathersname,
        fathers_phone : req.body.fathersphone,
        fathers_email : req.body.fathersemail,
        fathers_occuption : req.body.fathersoccuption,
        mothers_name : req.body.mothersname,
        mothers_phone : req.body.mothersphone,
        mothers_email : req.body.mothersemail,
        mothers_occupation : req.body.mothersoccupation,
        guardians_name : req.body.guardiansname,
        guardians_phone : req.body.guardiansphone,
        guardians_email : req.body.guardiansemail,
        guardians_occupation : req.body.guardiansoccupation,
        guardians_relationship : req.body.guardiansrelationship
      });
      student.save(student.changed, {patch: true}).then(function (newStudent) {
        StudentAdmission.findOne({student_id: newStudent.id}, {require: false})
        .then(function (studentAdmission) {
          if (!studentAdmission) {
            return res.status(400).send({success: false, msg: 'Invalid Request'});
          }
          studentAdmission.set({
            admission_date : req.body.sa[0].admissiondate,
            regular_class_id : req.body.sa[0].regularclassid,
            regular_division_id : req.body.sa[0].regulardivisionid,
            elgastart_class_id : req.body.sa[0].elgastartclassid,
            elgastart_division_id : req.body.sa[0].elgastartdivisionid,
            status : req.body.sa[0].status,
            academic_year_id : req.body.sa[0].academicyearid,
            elgaend_class_id : req.body.sa[0].elgaendclassid,
            elgaend_division_id : req.body.sa[0].elgaenddivisionid            
          });
          studentAdmission.save(studentAdmission.changed, {patch: true}).then(function (newStudent) {
            return res.status(200).send({success: true});
          })
          .then(null, function(err) {
            res.status(500).send({success: false, msg: err});
          });
        })
        .then(null, function(err) {
          res.status(500).send({success: false, msg: err});
        });
      })
      .then(null, function(err) {
        res.status(500).send({success: false, msg: err});
      });  
    });
};

/**
 * @AUTHOR: Anuj Kothari,
 * @Dated: 29 Dec 2017,
 * @PARAMS: req, res, next
 * if studentid(blank, null, nan) & deletetype(blank, null, not in(p,t)) - return 400
 * if student doesnt - respond invalid request
 * if user doesnt have access to the student - respond invalid request
 * if deletetype is "p" then set isactive false in student table
 * if delete type is "t" then set isactive flase in admission record
 */
exports.destroy = function (req, res, next) { 
  req.assert('id', 'Invalid Request.').notEmpty().isNumeric();
  req.assert('deletetype', 'Invalid Request.').notEmpty().isLength({min:1, max: 1});

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  Student.findOne({id: req.params.id}, {require: false})
    .then(function(student){
      if(!student){
        res.status(500).send({success: true, msg: "Invalid Request"});
      }
      StudentAdmission.findOne({'student_id': req.params.id, 'school_id': req.params.school_id}, {require: true})
        .then(function(studentAdmission){
          if(req.body.deletetype == "p"){
            student.save({ is_active: false }, {patch: true}).then(function(newStudent){
              res.status(200).send({success: true, msg: "Student Deactivated"});
            })
            .then(null, function(err) {
              res.status(500).send({success: false, msg: err});
            });
          } else if(req.body.deletetype == "t"){
            studentAdmission.save({ is_active: false }, {patch: true}).then(function(newStudentAdmission){
              res.status(200).send({success: true, msg: "Student Admission Deactivated"});
            })
            .then(null, function(err) {
              res.status(500).send({success: false, msg: err});
            });
          } else{
            res.status(200).send({success: false, msg: "Invalid Request"});
          }
        })
        .then(null, function(err){
          res.status(200).send({success: false, msg: "Invalid Request"});
        })
    })
    .then(null, function(err){
      res.status(500).send({success: false, msg: err.stack });
    });
};

/**
 * @AUTHOR: Anuj Kothari,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns Student details provided by ID
 */
exports.show = function (req, res, next) {
  req.assert('id', 'Invalid Request.').notEmpty();
  var errors = req.validationErrors();
  
  if (errors) {
    return res.status(400).send(errors);
  }

  //check if user has access to school
  var query = studentQueries.forAdmin();

  query.where({'s.id':req.params.id, 'sa.school_id': req.params.school_id});

  if (req.query.student_name) {
    query.where('s.first_name', 'ilike', '%' + req.query.student_name + '%');
  }

  if (req.query.regular_class_id) {
    query.where('sa.regular_class_id', req.query.regular_class_id);
  }

  if (req.query.regular_division_id) {
    query.where('sa.regular_division_id', req.query.regular_division_id);
  }

  if (req.query.elgastart_class_id) {
    query.where('sa.elgastart_class_id', req.query.elgastart_class_id);
  }

  if (req.query.elgastart_division_id) {
    query.where('sa.elgastart_division_id', req.query.elgastart_division_id);
  }

  query.limit(1);

  knexnest(query).then(function(results) {
    query = null;
    res.send({success: true, students: results[0]});
  })
  .then(null, function(err) {
    query = null;
    res.status(500).send({success: false, msg: err});
  });  
};


/**
 * @AUTHOR: Anuj Kothari,
 * @Dated: 2 Jan 2018,
 * @PARAMS: req, res, next
 * Returns Student details provided by ID
 */
exports.export = function (req, res, next) {
  req.assert('school_id', 'Invalid Request.').notEmpty();
  var errors = req.validationErrors();
  
  if (errors) {
    return res.status(400).send(errors);
  }

  //check if user has access to school
  
  var query  = studentQueries.forAdmin();
  query.where('sa.school_id',req.params.school_id);
  if (req.query.student_name) {
    query.where('s.first_name', 'ilike', '%' + req.query.student_name + '%');
  }

  if (req.query.regular_class_id) {
    query.where('sa.regular_class_id', req.query.regular_class_id);
  }

  if (req.query.regular_division_id) {
    query.where('sa.regular_division_id', req.query.regular_division_id);
  }

  if (req.query.elgastart_class_id) {
    query.where('sa.elgastart_class_id', req.query.elgastart_class_id);
  }

  if (req.query.elgastart_division_id) {
    query.where('sa.elgastart_division_id', req.query.elgastart_division_id);
  }

  query.then(function(results) {
    if(results.length == 0){
      res.status(200).send({success: true, msg: "No Students"});
    } else {
      var ws = XLSX.utils.json_to_sheet(results);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "StudentList");
      var buf = XLSX.write(wb, {type:'buffer', bookType:"xlsx", compression:true, Props:{Title:"SheetJS"}, sheet: "anuj"});
      res.status(200).send(buf);
    }
  })
  .then(null, function(err) {
    res.status(500).send({success: false, msg: err});
  });  
};


/**
 * @AUTHOR: Anuj Kothari,
 * @Dated: 2 Jan 2018,
 * @PARAMS: req, res, next
 * if no file return error
 * if invalid file or  no jsondata return error
 * for each row in jsondata
 *  if studentcode present - add studentname to alreadyexists array
 *  else make entry for student
 *    if success add studentname to successfullyadded array
 *    else add studentname to erroradding array
 *  respond with all three arrays and the counts
 */
exports.import = function (req, res, next) {
  req.assert('school_id', 'Invalid Request.').notEmpty();
  var errors = req.validationErrors();
  
  if (errors) {
    res.status(400).send(errors);
  }

  if(!req.files){
    res.send("File was not found");
  }
  var alreadyExists = [];
  var successfullyAdded = [];
  var errorAdding = [];
  var errorEditing = [];

  var rows = XLSX.utils.sheet_to_json(XLSX.read(req.files.studentimport.data).Sheets.SheetJS);

  var Masters = {};

  let getClassMasters = function() {
    return new Promise(function(resolve, reject)  {
      Class.findAll().then(function(classresult){
        Masters.classes = classresult.models;
        resolve(Masters.classes);
      });
    });
  };

  let getDivisionMasters = function() {
    return new Promise(function(resolve, reject)  {
      Division.findAll().then(function(divisionresult){
        Masters.divisions = divisionresult.models;
        resolve(Masters.divisions);
      });
    });
  };

  Promise.all([ 
    getClassMasters(),
    getDivisionMasters()
  ]).then(function(){
    async.each(rows, function(row, callback) {
      if(row.student_code){
        Student
          .findAll({student_code: row.student_code}, {require: false})
          .then(function (student){
            if(student){
              alreadyExists.push(row.student_code);
              callback();
            }
          })
          .then(null, function(err) {
            errorEditing.push(row.student_code);
            callback();
          })
      }else{
        Student.create({
          first_name : row.first_name,
          middle_name : row.middle_name,
          last_name : row.last_name,
          date_of_birth : row.date_of_birth,
          gender : modelUtils.getGenderIdFromGender(row.gender),
          blood_group : row.blood_group,
          address_line_1 : row.address_line_1,
          address_line_2 : row.address_line_2,
          address_line_3 : row.address_line_3,
          pincode_id : row.pincode_id,
          fathers_name : row.fathers_name,
          fathers_phone : row.fathers_phone,
          fathers_email : row.fathers_email,
          fathers_occuption : row.fathers_occuption,
          mothers_name : row.mothers_name,
          mothers_phone : row.mothers_phone,
          mothers_email : row.mothers_email,
          mothers_occupation : row.mothers_occupation,
          guardians_name : row.guardians_name,
          guardians_phone : row.guardians_phone,
          guardians_email : row.guardians_email,
          guardians_occupation : row.guardians_occupation,
          guardians_relationship : row.guardians_relationship,
          is_active: true
        })
          .then(function (student){
            StudentAdmission.create({
              student_id : student.id,
              admission_date : row.admission_date,
              regular_class_id : modelUtils.getIdFromname(row.regular_class, Masters.classes),
              regular_division_id : modelUtils.getIdFromname(row.regular_division, Masters.divisions),
              elgastart_class_id : row.elgastart_class_id,
              elgastart_division_id : row.elgastart_division_id,
              status : "Active",
              academic_year_id : modelUtils.getAcademicyearIdfromAcademicyear(row.academic_year),
              school_id : req.params.school_id,
              elgaend_class_id : row.elgaend_class_id,
              elgaend_division_id : row.elgaend_division_id
          })
          .then(function(newStudentAdmission){
            successfullyAdded.push(row.student_code);
            callback();
          })
          .then(null, function(err){
            errorAdding.push(row.student_code);
            callback();
          });
        })
        .then(null, function(err) {
          errorAdding.push(row.student_code);
          callback();
        });
      }
    }, function(err) {
        if( err ) {
          res.status(200).send({
            success: false
          });
        } else {
          res.status(200).send({
            success: true, 
            alreadyExists: alreadyExists, 
            errorEditing: errorEditing, 
            successfullyAdded: successfullyAdded,
            errorAdding: errorAdding
          });
        }
    });
  });
};