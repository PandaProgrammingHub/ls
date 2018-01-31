var Classes = require('../models/classes');
var Subjects = require('../models/subjects');
var modelBase = require('../config/bookshelf');

var classSubjectsConfig = modelBase.extend({
  tableName: 'class_subjects',
  hasTimestamps: true
});

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns list of all classes
 */
exports.index = function (req, res, next) {
  Classes
    .forge().orderBy('class_type', 'DESC').orderBy('name', 'ASC')
    .fetchAll({
      withRelated: ['subjects']
    })
    .then(function (items) {
      return res.status(200).send({success: true, classes: items.toJSON()});
    })
    .catch(function(err){
      return res.status(500).send({success: false, msg: "Internal Error"});
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * if name and type is blank respond error
 * add name and type into classes table
 */
exports.create = function (req, res, next) {
  req.assert('name', 'class name cannot be blank').notEmpty();
  req.assert('class_code', 'class code cannot be blank').notEmpty();
  req.assert('class_type', 'class code cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  var className = req.body.name;
  var classCode = req.body.class_code;
  checkExist(className, '').then(function (exist) {
    if(exist) {
      return res.status(200).send({ success: false, msg: 'class name already exist' });
    } else {
      checkCodeExist(classCode, '').then(function (exist) {
        if(exist) {
          return res.status(200).send({ success: false, msg: 'class code already exist' });
        } else {
          Classes.create({
            name: className,
            class_code: req.body.class_code,
            class_type: req.body.class_type
          })
            .then(function (class_details) {
              if (req.body.subject_ids && req.body.subject_ids.length > 0) {
                var length = req.body.subject_ids.length;
                var i = 0;
                req.body.subject_ids.forEach(function (subjectId) {
                  i++;
                  addClassSubjectConfig(subjectId, class_details.id);
                  if (i === length) {
                    return res.status(200).send({ success: true, class: class_details.toJSON() });
                  }
                });
              } else {
                return res.status(200).send({ success: true, class: class_details.toJSON() });
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
 * if name and id is blank respond error
 * check class
 *  if not exist
 *    respond error
 *  else
 *    update the class
 */
exports.upsert = function (req, res, next) {
  if (req.body.name) {
    req.assert('name', 'Class name cannot be blank').notEmpty();
  }
  if (req.body.class_code) {
    req.assert('class_code', 'Class code cannot be blank').notEmpty();
  }
  if (req.body.class_type) {
    req.assert('class_type', 'Class type cannot be blank').notEmpty();
  }
  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  Classes.findOne({id: req.params.id}, {require: false})
    .then(function (class_details) {
      var className = req.body.name;
      var classCode = req.body.class_code;

      if( (className.toLowerCase() !== class_details.attributes.name.toLowerCase())
        && (classCode.toLowerCase() !== class_details.attributes.class_code.toLowerCase()) ) {
        checkExist(className, req.params.id).then(function (exist) {
          if(exist) {
            return res.status(200).send({ success: false, msg: 'Class name already exist' });
          } else {
            checkCodeExist(classCode, req.params.id).then(function (exist) {
              if(exist) {
                return res.status(200).send({ success: false, msg: 'Class code already exist' });
              } else {
                updateClass(req, res, class_details);
              }
            });
          }
        });
      } else if( className.toLowerCase() !== class_details.attributes.name.toLowerCase() ) {
        checkExist(className, req.params.id).then(function (exist) {
          if(exist) {
            return res.status(200).send({ success: false, msg: 'Class name already exist' });
          } else {
            updateClass(req, res, class_details);
          }
        });
      } else if( classCode.toLowerCase() !== class_details.attributes.class_code.toLowerCase() ) {
        checkCodeExist(classCode, req.params.id).then(function (exist) {
          if(exist) {
            return res.status(200).send({ success: false, msg: 'Class code already exist' });
          } else {
            updateClass(req, res, class_details);
          }
        });
      } else {
        updateClass(req, res, class_details);
      }
  });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * check class
 *  if not exist
 *    respond error
 *  else
 *    delete class
 */
exports.destroy = function (req, res, next) {
  Classes.findOne({id: req.params.id}, {require: false})
    .then(function (class_details) {
      if (!class_details) {
        return res.status(400).send({success: false, msg: 'Class does not exist'});
      }

      Classes.destroy({id: req.params.id})
        .then(function () {
          return res.status(200).send({success: true, msg: 'Class successfully deleted.'});
        })
        .catch(function (err) {
          return res.status(400).send({success: false, msg: 'Class not deleted.'});
        });
    });
};

function addClassSubjectConfig(subjectId, classId) {
  Subjects.findOne({id: subjectId}, {require: false})
    .then(function (subject_details) {
      if (subject_details) {
        classSubjectsConfig.findOne({class_id: classId, subject_id: subjectId}, {require: false})
          .then(function (class_subject_config) {
            if (!class_subject_config) {
              classSubjectsConfig.create({
                class_id: classId,
                subject_id: subjectId
              })
                .then(function (config) {
                  return config;
                });
            }
          });
      }
    });
}

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns list of all classes
 */
exports.show = function (req, res, next) {
  Classes
    .where({id: req.params.id})
    .fetch({
      withRelated: ['subjects']
    })
    .then(function (item) {
      if(!item) {
        return res.status(400).send({success: false, msg: 'Class does not exists.'});
      }
      return res.status(200).send({success: true, class: item.toJSON()});
    })
    .catch(function (err) {
      return res.status(400).send({success: false, msg: 'Class does not exists.'});
    });
};

function checkExist(className, id) {
  return new Promise(function (resolve, reject) {
    let exist = false;
    Classes.findAll()
      .then(function (classes) {
        classes = classes.toJSON();
        var length = classes.length;
        var iterator = 0;
        classes.forEach(function (classobj) {
          iterator++;
          if(id && id.length > 0) {
            if(id !== classobj.id) {
              if(className.toLowerCase() === classobj.name.toLowerCase()) {
                exist = true;
              }
            }
          } else {
            if(className.toLowerCase() === classobj.name.toLowerCase()) {
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

function checkCodeExist(classCode, id) {
  return new Promise(function (resolve, reject) {
    let exist = false;
    Classes.findAll()
      .then(function (classes) {
        classes = classes.toJSON();
        var length = classes.length;
        var iterator = 0;
        classes.forEach(function (classobj) {
          iterator++;
          if(id && id.length > 0) {
            if(id !== classobj.id) {
              if(classCode.toLowerCase() === classobj.class_code.toLowerCase()) {
                exist = true;
              }
            }
          } else {
            if(classCode.toLowerCase() === classobj.class_code.toLowerCase()) {
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

function updateClass(req, res, class_details) {
  if (req.body.name) {
    class_details.set('name', req.body.name);
  }
  if (req.body.class_code) {
    class_details.set('class_code', req.body.class_code);
  }
  if (req.body.class_type) {
    class_details.set('class_type', req.body.class_type);
  }

  class_details.save(class_details.changed, {patch: true})
    .then(function (newClass) {
      if (req.body.subject_ids && req.body.subject_ids.length > 0) {
        var length = req.body.subject_ids.length;
        var i = 0;
        req.body.subject_ids.forEach(function (subjectId) {
          i++;
          addClassSubjectConfig(subjectId, newClass.id);
          if (i === length) {
            return res.status(200).send({success: true, class: newClass.toJSON()});
          }
        });
      } else {
        return res.status(200).send({success: true, class: newClass.toJSON()});
      }
    });
}