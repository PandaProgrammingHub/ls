var Subjects = require('../models/subjects');

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns list of all subjects
 */
exports.index = function (req, res, next) {
  Subjects.findAll()
    .then(function (items) {
      return res.status(200).send({success: true, subjects: items.toJSON()});
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * if name and type is blank respond error
 * add name and type into subjects table
 */
exports.create = function (req, res, next) {
  req.assert('name', 'subject name cannot be blank').notEmpty();
  req.assert('code', 'subject code cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  var subjectName = req.body.name;
  var subjectCode = req.body.code;
  checkExist(subjectName, '').then(function (exist) {
    if(exist) {
      return res.status(200).send({ success: false, msg: 'Subject name already exist' });
    } else {
      checkCodeExist(subjectCode, '').then(function (exist) {
        if(exist) {
          return res.status(200).send({ success: false, msg: 'Subject code already exist' });
        } else {
          Subjects.create({
            name: subjectName,
            code: req.body.code
          })
            .then(function (subject_details) {
              return res.status(200).send({success: true, subject: subject_details.toJSON()});
            });
        }
      });
    }
  });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * if name and id is blank respond error
 * check subject
 *  if not exist
 *    respond error
 *  else
 *    update the subject
 */
exports.upsert = function (req, res, next) {
  if (req.body.name) {
    req.assert('name', 'Subject name cannot be blank').notEmpty();
  }
  if (req.body.code) {
    req.assert('code', 'Subject code cannot be blank').notEmpty();
  }
  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  Subjects.findOne({id: req.params.id}, {require: false})
    .then(function (subject_details) {
      if (!subject_details) {
        return res.status(400).send({success: false, msg: 'Subject does not exist'});
      }
      var subjectName = req.body.name;
      var subjectCode = req.body.code;

      if( (subjectName.toLowerCase() === subject_details.attributes.name.toLowerCase())
        && (subjectCode.toLowerCase() === subject_details.attributes.code.toLowerCase()) ) {
        if (req.body.name) {
          subject_details.set('name', subjectName);
        }
        if (req.body.code) {
          subject_details.set('code', subjectCode);
        }
        subject_details.save(subject_details.changed, {patch: true}).then(function (newSubject) {
          return res.status(200).send({success: true, class: newSubject.toJSON()});
        });
      } else {
        checkExist(subjectName, req.params.id).then(function (exist) {
          if(exist) {
            return res.status(200).send({ success: false, msg: 'Subject name already exist' });
          } else {
            checkCodeExist(subjectCode, req.params.id).then(function (exist) {
              if(exist) {
                return res.status(200).send({ success: false, msg: 'Subject code already exist' });
              } else {
                if (req.body.name) {
                  subject_details.set('name', subjectName);
                }
                if (req.body.code) {
                  subject_details.set('code', req.body.code);
                }
                subject_details.save(subject_details.changed, {patch: true}).then(function (newSubject) {
                  return res.status(200).send({success: true, class: newSubject.toJSON()});
                });
              }
            });
          }
        });
      }
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * check subject
 *  if not exist
 *    respond error
 *  else
 *    delete subject
 */
exports.destroy = function (req, res, next) {
  Subjects.findOne({id: req.params.id}, {require: false})
    .then(function (subject_details) {
      if (!subject_details) {
        return res.status(400).send({success: false, msg: 'Subject does not exist'});
      }

      Subjects.destroy({id: req.params.id})
        .then(function () {
          return res.status(200).send({success: true, msg: 'Subject successfully deleted.'});
        })
        .catch(function () {
          return res.status(400).send({success: false, msg: 'Subject not deleted.'});
        });
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns subject details
 */
exports.show = function (req, res, next) {
  Subjects.findOne({id: req.params.id})
    .then(function (item) {
      if (!item) {
        return res.status(400).send({success: false, msg: 'Subject does not exists.'});
      }
      return res.status(200).send({success: true, subject: item.toJSON()});
    })
    .catch(function (err) {
      return res.status(400).send({success: false, msg: 'Subject does not exists.'});
    });
};

function checkExist(subjectName, id) {
  return new Promise(function (resolve, reject) {
    let exist = false;
    Subjects.findAll()
      .then(function (subjects) {
        subjects = subjects.toJSON();
        var length = subjects.length;
        var iterator = 0;
        subjects.forEach(function (subject) {
          iterator++;
          if(id && id.length > 0) {
            if(id !== subject.id) {
              if(subjectName.toLowerCase() === subject.name.toLowerCase()) {
                exist = true;
              }
            }
          } else {
            if(subjectName.toLowerCase() === subject.name.toLowerCase()) {
              exist = true;
            }
          }
        });
        if(iterator === length) {
          resolve(exist);
        }
      });
  });
}

function checkCodeExist(subjectCode, id) {
  return new Promise(function (resolve, reject) {
    let exist = false;
    Subjects.findAll()
      .then(function (subjects) {
        subjects = subjects.toJSON();
        var length = subjects.length;
        var iterator = 0;
        subjects.forEach(function (subject) {
          iterator++;
          if(id && id.length > 0) {
            if(id !== subject.id) {
              if(subjectCode.toLowerCase() === subject.code.toLowerCase()) {
                exist = true;
              }
            }
          } else {
            if(subjectCode.toLowerCase() === subject.code.toLowerCase()) {
              exist = true;
            }
          }
        });
        if(iterator === length) {
          resolve(exist);
        }
      });
  });
}