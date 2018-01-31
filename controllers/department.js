let Department = require('../models/departments');
let _ = require('lodash');

/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 26 Dec 2017,
 * @PARAMS: req, res, next
 *
 */

exports.addDepartment = function (req, res, next) {
  req.assert('name', 'Department name cannot be blank').notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  Department.findOne({ name: req.body.name, is_enabled: true }, {require: false})
    .then((dept) => {
      if (dept) {
        let msg = "Department with that name already exists";
        return res.status(200).send({ success: false, msg: msg });
      } else {
        Department.create(req.body)
          .then(function (new_dept) {
            return res.status(200).send({ success: true, addedDepartment: new_dept.toJSON() });
          }, (err) => {
            let msg = "";
            if (err.code == 23503)
              msg = "Department manager is invalid";
            else
              msg = "Department could not be added. Please check and try again.";
            return res.status(200).send({ success: false, msg: msg });
          });
      }
    });
};

/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 26 Dec 2017,
 * @PARAMS: req, res, next
 *
 */

exports.editDepartment = function (req, res, next) {
  req.assert('name', 'Department name cannot be blank').notEmpty();
  let errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  Department.findOne({ id: req.params.id, is_enabled: true }, { require: false })
    .then(function (department) {
      var departmentMangerName = req.body.name;
      departmentMangername = departmentMangerName.toLowerCase().trim();
      if (!department) {
        return res.status(200).send({ success: false, msg: 'Department does not exist.' });
      } else {
        Department.findOne({ name: departmentMangername,  is_enabled: true }, { require: false })
        .then(function (edit_duplicate) {
          if (!edit_duplicate) {
            department.set("manager_id", req.body.manager_id);
            department.set("name", req.body.name);
            
            department.save(department.changed, { patch: true })
              .then(function (new_dept) {
                return res.status(200).send({ success: true, updatedDepartment: new_dept.toJSON() });
              }, (err) => {
                let msg = "";
                if (err.code == 23503)
                  msg = "Department manager is invalid";
                else
                  msg = "Department could not be upated. Please check and try again.";
                return res.status(200).send({ success: false, msg: msg });
              });
          }
          else {
            return res.status(200).send({ success: false, msg: 'Deparment Manager name already exist' });
          }
        });
      }
    });
};

/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 21 Dec 2017,
 * @PARAMS: req, res, next
 *
 */
exports.getAllDepartments = function (req, res, next) {

  Department.where('is_enabled', true).fetchAll({
    withRelated: ['manager.userDetails']
  })
    .then(function (departments) {
      if (!departments || departments.length == 0) {
        let msg = "No departments found.";
        return res.status(200).send({ success: false, msg: msg });
      } else {

        let results = _.map(departments.toJSON(), (v, i, c) => {

          let newValue = {
            id: v.id,
            name: v.name,
            manager: {
              id: _.get(v, "manager.id", ""),
              name: _.get(v, "manager.userDetails.name", "")
            }
          };
          return newValue;

        });

        return res.status(200).send({ success: true, data: results });
      }
    }, function (err) {
      let msg = "There was an error fetching departments";
      return res.status(200).send({ success: false, msg: msg });
    });
};

/**
 * @AUTHOR: leadschool,
 * @Dated: 28 Dec 2017,
 * @PARAMS: req, res, next
 * Returns Department details on particular id
 */
exports.show = function (req, res, next) {
  Department.findOne({id: req.params.id})
    .then(function (item) {
      if(!item) {
        return res.status(400).send({success: false, msg: 'Department does not exist'});
      }
      return res.status(200).send({success: true, data: item.toJSON()});
    })
    .catch(function (err) {
      return res.status(400).send({success: false, msg: 'Department does not exist'});
    });
};