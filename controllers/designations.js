let Designation = require('../models/designations');
let _ = require('lodash');

exports.getAllDesignations = getAllDesignations;
exports.addDesignation = addDesignation;
exports.editDesignation = editDesignation;

/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 26 Dec 2017,
 * @PARAMS: req, res, next
 *
 */

function addDesignation(req, res, next) {
  req.assert('name', 'Designation name cannot be blank').notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  Designation.findOne({ name: req.body.name, is_enabled: true }, {require: false})
    .then((designation) => {
      
      if (designation) {
        let msg = "Designation already exists";
        return res.status(200).send({ success: false, msg: msg });
      } else {
        Designation.create(req.body)
          .then(function (new_designation) {
            return res.status(200).send({ success: true, addedDesignation: new_designation.toJSON() });
          }, (err) => {
            let msg = "Designation could not be added. Please check and try again.";
            return res.status(200).send({ success: false, msg: msg });
          });
      }
    }, (err) => {
      let msg = "Designation could not be added. Please check and try again.";
      return res.status(200).send({ success: false, msg: msg });
    });
}

/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 26 Dec 2017,
 * @PARAMS: req, res, next
 *
 */

function editDesignation(req, res, next) {
  req.assert('name', 'Designation name cannot be blank').notEmpty();

  let errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  Designation.findOne({ id: req.params.id, is_enabled: true }, { require: false })
    .then(function (designation) {

      if (!designation) {
        let msg = "Designation does not exist.";
        return res.status(200).send({ success: false, msg: msg });
      } else {
        designation.set("name", req.body.name);

        designation.save(designation.changed, { patch: true })
          .then(function (new_designation) {
            return res.status(200).send({ success: true, updatedDesignation: new_designation.toJSON() });
          }, (err) => {
            let msg = "Designation could not be updated. Please check and try again.";
            return res.status(200).send({ success: false, msg: msg });
          });
      }
    }, (err) => {
      let msg = "There was an error updating designation, please check and try agian.";
      return res.status(200).send({ success: false, msg: msg });
    });
}


/**
 * @AUTHOR: Sagar Sodah,
 * @Dated: 21 Dec 2017,
 * @PARAMS: req, res, next
 *
 */
function getAllDesignations(req, res, next) {

  Designation.where('is_enabled', true).fetchAll()
    .then(function (designations) {
      if (!designations || designations.length == 0) {
        return res.status(200).send({ success: false, msg: 'No Designations found.' });
      } else {

        let results = _.map(designations.toJSON(), (v, i, c) => {

          let newValue = {
            id: v.id,
            name: v.name
          };
          return newValue;

        });

        return res.status(200).send({ success: true, data: results });
      }
    }, function (err) {
      return res.status(200).send({ success: false, msg: 'There was an error fetching designations' });
    });
}

/**
 * @AUTHOR: leadschool,
 * @Dated: 28 Dec 2017,
 * @PARAMS: req, res, next
 * Returns Designation details on particular id
 */
exports.show = function (req, res, next) {
  Designation.findOne({id: req.params.id})
    .then(function (item) {
      if(!item) {
        return res.status(400).send({success: false, msg: 'Component does not exist'});
      }
      return res.status(200).send({success: true, data: item.toJSON()});
    })
    .catch(function (err) {
      return res.status(400).send({success: false, msg: 'Component does not exist'});
    });
};