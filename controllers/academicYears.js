var AcademicYears = require('../models/academicYears');

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns list of all Academic Years
 */
exports.index = function (req, res, next) {
  AcademicYears
    .fetchAll()
    .then(function (items) {
      return res.status(200).send({success: true, academicYears: items.toJSON()});
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
  req.assert('code', 'Academic Year name cannot be blank').notEmpty();
  req.assert('start_date', 'Academic Year start date cannot be blank').notEmpty();
  req.assert('end_date', 'Academic Year end date cannot be blank').notEmpty();
  req.assert('short_code', 'Academic Year short code cannot be blank').notEmpty();
  req.assert('active', 'Academic Year active cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  AcademicYears.create({
    code: req.body.code,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    short_code: req.body.short_code,
    active: req.body.active
  })
    .then(function (academic_years_details) {
      return res.status(200).send({ success: true, academicYears: academic_years_details.toJSON() });
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
  req.assert('code', 'Academic Year name cannot be blank').notEmpty();
  req.assert('start_date', 'Academic Year start date cannot be blank').notEmpty();
  req.assert('end_date', 'Academic Year end date cannot be blank').notEmpty();
  req.assert('short_code', 'Academic Year short code cannot be blank').notEmpty();
  req.assert('active', 'Academic Year active cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  AcademicYears.findOne({id: req.params.id}, {require: false})
    .then(function (academic_years_details) {
      if (!academic_years_details) {
        return res.status(400).send({success: false, msg: 'Academic Year does not exist'});
      }

      academic_years_details.set('code', req.body.code);
      academic_years_details.set('start_date', req.body.start_date);
      academic_years_details.set('end_date', req.body.end_date);
      academic_years_details.set('short_code', req.body.short_code);
      academic_years_details.set('active', req.body.active);
      academic_years_details
        .save(academic_years_details.changed, {patch: true})
        .then(function (newAcademicYear) {
          return res.status(200).send({success: true, academicYear: newAcademicYear.toJSON()});
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
 *    delete class
 */
exports.destroy = function (req, res, next) {
  AcademicYears.findOne({id: req.params.id}, {require: false})
    .then(function (academic_year_details) {
      if (!academic_year_details) {
        return res.status(400).send({success: false, msg: 'Academic Year does not exist'});
      }

      AcademicYears.destroy({id: req.params.id})
        .then(function () {
          return res.status(200).send({success: true, msg: 'Academic Year successfully deleted.'});
        })
        .catch(function () {
          return res.status(400).send({success: false, msg: 'Academic Year not deleted.'});
        });
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns list of all classes
 */
exports.show = function (req, res, next) {
  AcademicYears
    .where({id: req.params.id})
    .fetch()
    .then(function (item) {
      if(!item) {
        return res.status(400).send({success: false, msg: 'Academic Year does not exists.'});
      }
      return res.status(200).send({success: true, academicYears: item.toJSON()});
    })
    .catch(function (err) {
      return res.status(400).send({success: false, msg: 'Academic Year does not exists.'});
    });
};