var config = require('../knexfile');
var knex = require('knex')(config);
var knexnest = require('knexnest');
var Student = require('../models/students');
var XLSX = require('xlsx');
var Classes = require('../models/classes');
var Division = require('../models/divisions');
var BoyElgaAssessment = require('../models/boyElgaAssessment');
var StudentAdmissions = require('../models/studentAdmissions');
var modelUtils = require('../utils/modelUtils');
var async = require('async');

/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 9 Jan 2018,
 * @PARAMS: req, res, next
 * Get the school_id
 *  if school_id is blank, null or nan - respond error
 *  The the page number
 *  Get the list of students from that school as per page
 *  Return the information
 */
exports.index = function (req, res, next) {
  req.assert('school_id', 'School id cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  var page = 1;
  var pageSize = 10;

  if (req.query.page) {
    page = req.query.page;
  }

  // if (req.query.pageSize) {
  //   pageSize = req.query.pageSize;
  // }

  var query = knex.from('student_admissions as sa')
    .innerJoin('students as s', 'sa.student_id', 's.id')
    .leftJoin('boy_elga_assessments as b', 'sa.id', 'b.student_admission_id')
    .leftJoin('classes as cr', 'cr.id', 'sa.regular_class_id')
    .leftJoin('divisions as dr', 'dr.id', 'sa.regular_division_id')
    .leftJoin('classes as t1c', 't1c.id', 'b.T1Level')
    .leftJoin('classes as t2c', 't2c.id', 'b.T2Level')
    .leftJoin('classes as t3c', 't3c.id', 'b.T3Level')
    .leftJoin('classes as t4c', 't4c.id', 'b.T4Level')
    .leftJoin('classes as aec', 'aec.id', 'b.assignedElga')
    .where('sa.school_id', req.query.school_id)
    //TODO: Add where for academic year
    .select(
    [
      's.id as _id',
      'b.id as _boyAssessmentId',
      'sa.id as _admissionId',
      's.student_code as _studentCode',

      //TEST 1
      't1c.id as _T1_id',
      't1c.literacy_level_start as _T1_level',
      'b.T1Score as _T1_score',

      //TEST 2
      't2c.id as _T2_id',
      't2c.literacy_level_start as _T2_level',
      'b.T2Score as _T2_score',

      //TEST 3
      't3c.id as _T3_id',
      't3c.literacy_level_start as _T3_level',
      'b.T3Score as _T3_score',

      //TEST 4
      't4c.id as _T4_id',
      't4c.literacy_level_start as _T4_level',
      'b.T4Score as _T4_score',

      'aec.id as _assignedElga_id',
      'aec.name as _assignedElga_name',
      's.first_name as _sfirstname',
      's.middle_name as _smiddlename',
      's.last_name as _slastname',
      'cr.id as _class_id',
      'cr.name as _class_name',
      'dr.id as _division_id',
      'dr.name as _division_name'

    ]
    );

  if (req.query.student_name && req.query.student_name != "") {
    query.where('s.first_name', 'ilike', '%' + req.query.student_name + '%');
  }

  if (req.query.class_id && req.query.class_id != "") {
    query.where('sa.regular_class_id', req.query.class_id);
  }

  if (req.query.division_id && req.query.division_id != "") {
    query.where('sa.regular_division_id', req.query.division_id);
  }

  if (req.query.elga_assigned && req.query.elga_assigned != "") {
    if (req.query.elga_assigned == "true") {
      query.whereNotNull('b.assignedElga');
    } else if (req.query.elga_assigned == "false") {
      query.whereNull('b.assignedElga');
    }
  }


  query.limit(pageSize).offset(pageSize * (page - 1));

  knexnest(query).then(function (results) {
    if (!results || results.length == 0) {
      res.status(200).send({ success: false, msg: 'No students found.' });
    } else {
      res.send({ success: true, students: results });
    }
  })
    .then(null, function (err) {
      res.status(500).send({ success: false, msg: err });
    });

};

/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 9 Jan 2018,
 * @PARAMS: req, res, next
 * Check for required parameters.[student_id]
 * Add BoyElgaAssessment
 */
exports.destroy = function (req, res, next) {

  try {

    req.assert('student_admission_id', 'Student Admission id cannot be blank').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
      return res.status(400).send(errors);
    }

    BoyElgaAssessment.where({ student_admission_id: req.params.student_admission_id }).destroy()
      .then((assessment) => {
        res.status(200).send({ success: true, assessment: assessment });
      });
  } catch (err) {
    res.status(500).send({ success: false, msg: 'Error deleting assessment', error: err });
  }
};

/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 9 Jan 2018,
 * @PARAMS: req, res, next
 */
exports.edit = async function (req, res, next) {
  try {
    req.assert('student_admission_id', 'Student admission id cannot be blank.').notEmpty();
    req.assert('test_number', 'Test number cannot be blank.').notEmpty();
    req.assert('test_level_id', 'Test Level id cannot be blank.').notEmpty();
    req.assert('test_score', 'Test Score cannot be blank.').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
      return res.status(400).send(errors);
    }

    let student_admission_id = parseInt(req.params.student_admission_id);
    let testNumber = req.body.test_number;
    let testScore = req.body.test_score;

    let b = await BoyElgaAssessment.findOne({ student_admission_id: student_admission_id }, { require: false });

    if (!b) {
      b = await BoyElgaAssessment.create({ student_admission_id: student_admission_id });
    }
    let boy = b.toJSON();
    
    if (boy.assignedElga != null) {
      return res.status(400).send({ success: false, msg: 'Cannot save assessment, please delete the row and try again' });
    } else if (testNumber == 1
      && (
        (boy.T1Level != null || boy.T1Score != null)
        || (boy.T2Level != null || boy.T2Score != null)
        || (boy.T3Level != null || boy.T3Score != null)
        || (boy.T4Level != null || boy.T4Score != null))
    ) {
      return res.status(400).send({ success: false, msg: 'Cannot save assessment, please delete the row and try again' });
    } else if (testNumber == 2
      && (
        (boy.T2Level != null || boy.T2Score != null)
        || (boy.T3Level != null || boy.T3Score != null)
        || (boy.T4Level != null || boy.T4Score != null))
    ) {
      return res.status(400).send({ success: false, msg: 'Cannot save assessment, please delete the row and try again' });
    } else if (testNumber == 3
      && (boy.T3Level != null || boy.T3Score != null)
      || (boy.T4Level != null || boy.T4Score != null)
    ) {
      return res.status(400).send({ success: false, msg: 'Cannot save assessment, please delete the row and try again' });
    } else if (testNumber == 4
      && (boy.T4Level != null || boy.T4Score != null)
    ) {
      return res.status(400).send({ success: false, msg: 'Cannot save assessment, please delete the row and try again' });
    }


    let testLevel = await Classes.findOne({ id: req.body.test_level_id });

    testLevel = testLevel.toJSON();
    let pcScore = parseFloat(testScore) / parseFloat(testLevel.boy_max_marks) * 100;

    if (pcScore > 100) {
      return res.status(400).send({ success: false, msg: 'Score cannot be greater than maximum score of the test.' });
    }

    let status = null;
    let elgaSeqAssigned = 0;
    let elgaAssigned = null;
    let nextTestSeq = 0;

    if (pcScore < 60) {
      if (testLevel.class_sequence == 1) {
        status = 0;
        elgaSeqAssigned = testLevel.class_sequence;
      } else {
        status = -1;
        nextTestSeq = testLevel.class_sequence - 1;
      }
    } else if (pcScore < 80) {
      status = 0;
      elgaSeqAssigned = testLevel.class_sequence + 1;
    } else {
      status = 1;
      nextTestSeq = testLevel.class_sequence + 1;
    }
    console.log("__________________");
    //Enter into boy_elga_assessments table
    let prevTest = -1

    if (testNumber == 1) {
      b.set('T1Level', testLevel.id);
      b.set('T1Score', testScore);
    } else if (testNumber == 2) {
      b.set('T2Level', testLevel.id);
      b.set('T2Score', testScore);
      prevTest = boy.T1Level;
    } else if (testNumber == 3) {
      b.set('T3Level', testLevel.id);
      b.set('T3Score', testScore);
      prevTest = boy.T2Level;
    } else if (testNumber == 4) {
      b.set('T4Level', testLevel.id);
      b.set('T4Score', testScore);
      prevTest = boy.T3Level;
    }

    let nextTest = null;
    if (status != 0) {
      nextTest = await Classes.findOne({ class_type: 'elga', class_sequence: nextTestSeq }, { require: false });
    

      //If next test is same as previous test
      if (nextTest.attributes.id == prevTest) {
        if (status == -1) {
          status = 0;
          elgaSeqAssigned = testLevel.class_sequence;
        } else if (status == 1) {
          status = 0;
          elgaSeqAssigned = testLevel.class_sequence + 1;
        }
      }
    }
    //if test cleared in range Elga S,T,U or V
    if (testLevel.class_sequence == 19
      && (status == 0 || status == 1)) {
      status = 0;
      elgaSeqAssigned = 19;
    }


    if (status == 0) {
      elgaAssigned = await Classes.findOne({ class_type: 'elga', class_sequence: elgaSeqAssigned });
      b.set('assignedElga', elgaAssigned.id);
    }

    //Save Assessment info
    b.save(b.changed, { patch: true });

    //Prepare Response
    let response = {
      success: true,
      status: status
    };

    if (status == 0) {
      response.assignedElga = elgaAssigned;
      saveElgaStatus(student_admission_id, elgaAssigned.id);
    } else {
      response.nextTest = nextTest;
    }

    res.status(200).send(response);

  } catch (err) {
    res.status(500).send({ success: false, msg: 'An error occured. Please try again.', error: err });
    throw err;
  }
};


async function saveElgaStatus(id, elgaboy_class_id) {
  //Save elga assignment info in student admission
  let sa = await StudentAdmissions.findOne({ id: id });
  sa.set('elgaboy_class_id', elgaboy_class_id);
  return sa.save(sa.changed, { patch: true });
}

async function getElgaIdFromSeq(seq) {
  let elgaClass = await Classes.findOne({ class_type: 'elga', 'class_sequence': seq });
  return elgaClass.id;
} 