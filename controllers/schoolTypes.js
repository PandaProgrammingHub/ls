var SchoolTypes = require('../models/schoolTypes');

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns list of all School Types
 */
exports.index = function (req, res, next) {
  SchoolTypes
    .fetchAll()
    .then(function (items) {
      return res.status(200).send({success: true, schoolTypes: items.toJSON()});
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * if name and type is blank respond error
 * add name into School Types table
 */
exports.create = function (req, res, next) {
  req.assert('name', 'School Type name cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  SchoolTypes.create({
    name: req.body.name
  })
    .then(function (school_type_details) {
      return res.status(200).send({ success: true, schoolType: school_type_details.toJSON() });
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
 *    update the School Types
 */
exports.upsert = function (req, res, next) {
  req.assert('name', 'School Type name cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  SchoolTypes.findOne({id: req.params.id}, {require: false})
    .then(function (school_type_details) {
      if (!school_type_details) {
        return res.status(400).send({success: false, msg: 'School Type does not exist'});
      }

      school_type_details.set('name', req.body.name);
      school_type_details
        .save(school_type_details.changed, {patch: true})
        .then(function (newSchoolType) {
          return res.status(200).send({success: true, schoolType: newSchoolType.toJSON()});
        });
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
 *    delete School Types
 */
exports.destroy = function (req, res, next) {
  SchoolTypes.findOne({id: req.params.id}, {require: false})
    .then(function (school_type_details) {
      if (!school_type_details) {
        return res.status(400).send({success: false, msg: 'School Type does not exist'});
      }

      SchoolTypes.destroy({id: req.params.id})
        .then(function () {
          return res.status(200).send({success: true, msg: 'School Type successfully deleted.'});
        })
        .catch(function () {
          return res.status(400).send({success: false, msg: 'School Type not deleted.'});
        });
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns School Types
 */
exports.show = function (req, res, next) {
  SchoolTypes
    .where({id: req.params.id})
    .fetch()
    .then(function (item) {
      if(!item) {
        return res.status(400).send({success: false, msg: 'School Types does not exists.'});
      }
      return res.status(200).send({success: true, schoolType: item.toJSON()});
    })
    .catch(function (err) {
      return res.status(400).send({success: false, msg: 'School Types does not exists.'});
    });
};