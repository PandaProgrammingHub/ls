var Pincode = require('../models/pincodes');

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 *
 */
exports.addPincode = function (req, res, next) {
  req.assert('code', 'Pincode cannot be blank').notEmpty();
  req.assert('city', 'City cannot be blank').notEmpty();
  req.assert('state', 'State cannot be blank').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  Pincode.findOne({code: req.body.code}, {require: false})
    .then(function (pincode_details) {
      if(pincode_details) {
        return res.status(200).send({success: false, msg: 'Pincode already exist.'});
      } else {
        Pincode.create(req.body)
          .then(function (new_pincode) {
            return res.status(200).send({success: true, pincode: new_pincode.toJSON()});
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
exports.editPincode = function (req, res, next) {
  req.assert('city', 'City cannot be blank').notEmpty();
  req.assert('state', 'State cannot be blank').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  Pincode.findOne({id: req.params.id}, {require: false})
    .then(function (pincode_details) {
      if(!pincode_details) {
        return res.status(200).send({success: false, msg: 'Pincode does not exist.'});
      } else {
        pincode_details.set('city', req.body.city);
        pincode_details.set('state', req.body.state);

        pincode_details.save(pincode_details.changed, {patch: true})
          .then(function (new_pincode_details) {
            return res.status(200).send({success: true, pincode: new_pincode_details.toJSON()});
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
exports.getPincodeDetails = function (req, res, next) {
  var params = {};
  if(req.query.code) {
    params.code = req.query.code;
  }

  Pincode.findAll(params, {require: false})
    .then(function (pincodes) {
      if(!pincodes) {
        return res.status(200).send({success: false, msg: 'Pincode does not exist.'});
      } else {
        return res.status(200).send({success: true, pincode: pincodes.toJSON()});
      }
    });
};