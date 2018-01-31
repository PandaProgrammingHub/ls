let SchoolClass = require('../../models/schoolClasses');
let _ = require('lodash');


/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 27 Dec 2017,
 * @PARAMS: req, res, next
 *
 */

exports.editSchoolClass = function (req, res, next) {
  req.assert('id', 'School Class id cannot be blank').notEmpty();
  req.assert('class_teacher_id', 'Class teacher cannot be blank').notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  SchoolClass.findOne({ id: req.params.id, is_enabled: true }, { require: false })
    .then(function (schoolClass) {
      if (!schoolClass) {
        let msg = "Class does not exist";
        return res.status(200).send({ success: false, msg: msg });
      } else {

        schoolClass.set("class_teacher_id", req.body.class_teacher_id);

        schoolClass.save(schoolClass.changed, { patch: true })
          .then(function (new_class) {
            return res.status(200).send({ success: true, updatedClass: new_class.toJSON() });
          }, (err) => {
            let msg = "";
            //Foreign Key violation
            if (err.code == 23503)
              msg = "Class Teacher is invalid";
            else
              msg = "Class information could not be upated. Please check and try again.";
            return res.status(200).send({ success: false, msg: msg });
          });
      }
    });
    
};


/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 27 Dec 2017,
 * @PARAMS: req, res, next
 *
 */
exports.getAllSchoolClasses = function (req, res, next) {
  req.assert('school_id', 'School id cannot be blank').notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  SchoolClass.where({'school_id': req.params.school_id, 'is_enabled': true}).fetchAll({
    withRelated: ['class', 'division', 'classTeacher']
  })
    .then(function (classes) {
      if (!classes || classes.length == 0) {
        let msg = "No classes found.";
        return res.status(200).send({ success: false, msg: msg });
      } else {
        
        let results = _.map(classes.toJSON(), (v, i, c) => {

          let newValue = {
            id: v.id,
            class: {
              id: _.get(v, "class.id", ""),
              name: _.get(v, "class.name", "")
            },
            division: {
              id: _.get(v, "division.id", ""),
              name: _.get(v, "division.name", "")
            },
            classTeacher: {
              id: _.get(v, "classTeacher.id", ""),
              name: _.get(v, "classTeacher.name", "")
            }
          };
          return newValue;

        });
        
        return res.status(200).send({ success: true, classes: results });
      }
    }, function (err) {
      let msg = "There was an error fetching classes";
      return res.status(200).send({ success: false, msg: msg, error: err });
    });
};