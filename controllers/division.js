var Division = require('../models/divisions');


/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns list of all divisions
 */
exports.index = function (req, res, next) {
  Division.findAll()
    .then(function (items) {
      return res.status(200).send({success: true, divisions: items.toJSON()});
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * if name is blank respond error
 * add name into divisions table
 */
exports.create = function (req, res, next) {
  req.assert('name', 'Division name cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  var divisionName = req.body.name;
  divisionName = divisionName.toUpperCase().trim();

  Division.findOne({name: divisionName}, {require: false})
    .then(function (division) {
      if(!division) {
        Division.create({
          name: divisionName
        })
        .then(function (division_details) {
          return res.status(200).send({success: true, division: division_details.toJSON()});
        });
      } else {
        return res.status(200).send({success: false, msg: 'Division already exist'});
      }
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * if name and id is blank respond error
 * check divisions
 *  if not exist
 *    respond error
 *  else
 *    update the division name
 */
exports.upsert = function (req, res, next) {
  req.assert('name', 'Division name cannot be blank').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  Division.findOne({ id: req.params.id }, { require: false })
  .then(function (division_details) {
  
    if (!division_details) {
      return res.status(400).send({ success: false, msg: 'Division id does not exist' });
    }

    var divisionName = req.body.name;
    divisionName = divisionName.toUpperCase().trim();

    Division.findOne({ name: divisionName }, { require: false })
      .then(function (edit_duplicate) {
        if (!edit_duplicate) {
          division_details.set('name', divisionName);
          division_details.save(division_details.changed, {patch: true}).then(function (newDivision) {
            return res.status(200).send({success: true, division: newDivision.toJSON()});
          });
        }
        else {
          return res.status(200).send({ success: false, msg: 'Division name already exist' });
        }
      })
  });
};




/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * check component
 *  if not exist
 *    respond error
 *  else
 *    delete division
 */
exports.destroy = function (req, res, next) {
  Division.findOne({id: req.params.id}, {require: false})
    .then(function (division_details) {
      if (!division_details) {
        return res.status(400).send({success: false, msg: 'division id does not exist'});
      }

      Division.destroy({id: req.params.id})
        .then(function () {
          return res.status(200).send({success: true, msg: 'division successfully deleted.'});
        })
        .catch(function (err) {
          return res.status(400).send({success: false, msg: 'division not deleted.'});
        });

    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Returns division details provided by ID
 */
exports.show = function (req, res, next) {
  Division.findOne({id: req.params.id})
    .then(function (item) {
      if(!item) {
        return res.status(400).send({success: false, msg: 'Division does not exist'});
      }
      return res.status(200).send({success: true, division: item.toJSON()});
    })
    .catch(function (err) {
      return res.status(400).send({success: false, msg: 'Division does not exist'});
    });
};