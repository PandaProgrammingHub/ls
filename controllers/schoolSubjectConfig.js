var Schools = require('../models/school');
var SchoolSubjects = require('../models/schoolSubjects');
var Classes = require('../models/classes');
var Subjects = require('../models/subjects');
var UnitSequences = require('../models/unitSequence');

function addSchoolSubject(school_id, class_id, subject_id, board_id,unit_sequence_id) {
  SchoolSubjects.findOne({
    school_id: school_id,
    class_id: class_id,
    subject_id: subject_id,
    board_id: board_id
  }, { require: false }).then(function (schoolClass) {
    if (!schoolClass) {
      SchoolSubjects
        .create({
          school_id: school_id,
          class_id: class_id,
          subject_id: parseInt((typeof subject_id !== 'undefined' & subject_id)?subject_id:1),
          board_id: board_id,
          unit_sequence_id : unit_sequence_id,
        });
    }
  });
}

function addSubjectConfig(subject_config) {
  return new Promise(function (resolve, reject) {
    if (subject_config.regularClasses && subject_config.regularClasses.length > 0) {
      subject_config.regularClasses.forEach(function (config) {
        addSchoolSubject(subject_config.school_id, config.class_id, config.subject_id, config.unit_sequence_id, subject_config.board_id);
      });
    }

    if (subject_config.elgaClasses && subject_config.elgaClasses.length > 0) {
      subject_config.elgaClasses.forEach(function (config) {
        addSchoolSubject(subject_config.school_id, config.class_id, config.subject_id, config.unit_sequence_id, subject_config.board_id);
      });
    }

    resolve(true);
  });
}

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 *
 */
exports.addSchoolSubjectConfig = function (req, res, next) {
  req.assert('school_id', 'School cannot be blank').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  Schools.findOne({ id: req.body.school_id }, { require: false })
    .then(function (school_details) {
      if (!school_details) {
        return res.status(200).send({ success: false, msg: 'School does not exist.' });
      } else {
        addSubjectConfig(req.body)
          .then(function (subject_Config) {
            if(!subject_Config) {
              return res.status(200).send({success: false, msg: 'School Content config not save.',subject_Config: subject_Config});
            } else {
              return res.status(200).send({success: true,  msg: 'School Content config save successfully.', subject_Config: subject_Config});
            }
           // return res.status(200).send({ success: true, msg: 'School Content config save successfully.' });
          });
      }
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 *
 */
exports.getSchoolSubjectConfig = function (req, res, next) {
  SchoolSubjects.query((qb) => {

    qb.where('school_id', req.query.school_id);
    if (req.query.class_id && req.query.class_id != '')
      qb.where('class_id', req.query.class_id);
    if (req.query.division_id && req.query.division_id != '')
      qb.where('division_id', req.query.division_id);
    if (req.query.subject_id && req.query.subject_id != '')
      qb.where('subject_id', req.query.subject_id);
    if (req.query.subject_teacher_id && req.query.subject_teacher_id != '')
      qb.where('subject_teacher_id', req.query.subject_teacher_id);
      qb.orderBy('id','ASC'); 
  }).fetchAll({
    withRelated: ['class', 'division', 'subject', 'subject_teacher', 'academic_year', 'unit_sequence']
  }).then(function (school_content) {
    if (!school_content) {
      return res.status(200).send({ success: true, msg: 'School content not configured' });
    }
    addSchoolSubjectsMasters().then(function (schoolSubjectMasters) {
      return res.status(200).send({ success: true, school_content: school_content.toJSON(), masters: schoolSubjectMasters });
    });
  });
};

function addSchoolSubjectsMasters() {
  var masters = {};
  return new Promise(function (resolve, reject) {
    Classes.fetchAll({ withRelated: ['subjects'] }).then(function (classes) {
      masters.classes = classes.toJSON();
      Subjects.findAll().then(function (subjects) {
        masters.subjects = subjects.toJSON();
        UnitSequences.findAll().then(function (unitSequences) {
          masters.unitSequences = unitSequences.toJSON();
          resolve(masters);
        });
      });
    });
  });
}


/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 28 Dec 2017,
 * @PARAMS: req, res, next
 *
 */
exports.editSchoolSubject = function (req, res, next) {
  SchoolSubjects.findOne({ id: req.params.id }, { require: false })
    .then((subject) => {
      if (!subject) {
        let msg = "Subject does not exist.";
        return res.status(200).send({ success: false, msg: msg });
      } else {
        subject.set('subject_teacher_id', req.body.subject_teacher_id);
        subject.save(subject.changed, { patch: true })
          .then(function (new_subject) {
            return res.status(200).send({ success: true, updatedSubject: new_subject.toJSON() });
          }, (err) => {
            let msg = "";
            if (err.code == 23503)
              msg = "Subject Teacher is invalid";
            else
              msg = "Subject information could not be upated. Please check and try again.";
            return res.status(200).send({ success: false, msg: msg });
          });

      }
    });
};