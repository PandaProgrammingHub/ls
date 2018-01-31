var config = require('../knexfile');
var knex = require('knex')(config);
var CommunicationTemplate = require('../models/communicationTemplates');


/**
 * if name and module both are blank - respond name or module is compulsory
 * Get the list of templates as per the search
 */
exports.index = function (req, res, next) {
  if(req.query.name == null && req.query.module == null){
    res.status(400).send({success: false, msg: "Invalid Request"});
  }

  var query = knex.from('communication_templates as ct');
  if(req.query.name){
    query.where('ct.name', 'ilike', '%' + req.query.name + '%');
  }
  if(req.query.module){
    query.where('ct.module', req.query.module);
  }
  query.then(function (results) {
    return res.status(200).send({success: true, communicationTemplate: results});
  })
  .then(null, function(err){
    return res.status(500).send({success: false, msg:  err.stack });
  });
};

/**
 * if name is blank respond error
 * add name into communicationTemplates table
 */
exports.create = function (req, res, next) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('module', 'Module cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  CommunicationTemplate.create({
    name : req.body.name,
    module : req.body.module,
    description : req.body.description,
    email_isactive : req.body.email_isactive,
    email_subject : req.body.email_subject,
    email_content : req.body.email_content,
    sms_isactive : req.body.sms_isactive,
    sms_content : req.body.sms_content,
    notification_isactive : req.body.notification_isactive,
    notification_android_subject : req.body.notification_android_subject,
    notification_android_content : req.body.notification_android_content,
    notification_ios_content : req.body.notification_ios_content,
    created_by : req.body.created_by
  })
  .then(function (result) {
    return res.status(200).send({success: true, communicationTemplate: result});
  })
    .then(null, function(err){
    return res.status(500).send({success: true, communicationTemplate: "Invalid Request"});
  });

};

/**
 * if name and id is blank respond error
 * check communicationTemplates
 *  if not exist
 *    respond error
 *  else
 *    update the communicationTemplate name
 */
exports.edit = function (req, res, next) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('module', 'Module cannot be blank').notEmpty();
  req.assert('id', 'Invalid Request').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  CommunicationTemplate.findOne({id: req.params.id}, {require: true})
    .then(function(template){
      template.set({ 
        name : req.body.name,
        module : req.body.module,
        description : req.body.description,
        email_isactive : req.body.email_isactive,
        email_subject : req.body.email_subject,
        email_content : req.body.email_content,
        sms_isactive : req.body.sms_isactive,
        sms_content : req.body.sms_content,
        notification_isactive : req.body.notification_isactive,
        notification_android_subject : req.body.notification_android_subject,
        notification_android_content : req.body.notification_android_content,
        notification_ios_content : req.body.notification_ios_content,
      })
      .save(template.changed, {patch: true}).then(function(newTemplate){
        return res.status(200).send({success: true, communicationTemplate: newTemplate});
      })
      .then(null, function(err){
        if(err.constraint.includes("uk_")){
          return res.status(500).send({success: false, msg: "Name Already Exists"});
        } else{
          return res.status(500).send({success: false, msg: "Invalid Request"});
        }
      })
    })
    .then(null, function(err){
      return res.status(500).send({success: false, msg: "Invalid Request"});
    })
};

/**
 * Returns communicationTemplate details
 */
exports.show = function (req, res, next) {
  req.assert('id', 'Invalid Request').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  CommunicationTemplate.findOne({id: req.params.id}, {require: true})
    .then(function(result){
      return res.status(200).send({success: true, communicationTemplate: result});
    })
    .then(null, function(err){
      return res.status(500).send({success: false, msg: "Invalid Request"});
    })
};