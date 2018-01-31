var SchoolModel = require('../models/school');
var SchoolClassModel = require('../models/schoolClasses');
var DivisionModel = require('../models/divisions');
var ClasseModel = require('../models/classes');
var ClassConfigQueries = require('../queries/classConfig');
var async = require('async');

/**
 *  Get the class config group by division to get count of each division in it.
 *  Get the kit count and amount with it
 *  Remove the kit details from main list and make another object for it.
 *  Get class masters for ui and append to main list
 *  Respond with final result object
 */
exports.getSchoolClassConfig = async function (req, res, next) {
  req.assert('school_id', "Invalid Request").notEmpty();
  try{
    var query = ClassConfigQueries.forSchoolClassGroupedByDivision(req.params.school_id);
    var school_class_config = await query.then(function(school_class_config){
      return school_class_config;
    })
    
    if(school_class_config.length>0){
      var kits = {
        institutional_kits_count: school_class_config[0].institutional_kits_count,
        institutional_kits_amount: school_class_config[0].institutional_kits_amount,
        technology_kits_count: school_class_config[0].technology_kits_count,
        technology_kits_amount: school_class_config[0].technology_kits_amount
      }

      for( var i = 0; i<school_class_config.length; i++ ){
        delete school_class_config[i].institutional_kits_count;
        delete school_class_config[i].institutional_kits_amount;
        delete school_class_config[i].technology_kits_count;
        delete school_class_config[i].technology_kits_amount;
      }
    }
  
    addSchoolClassConfigMasters().then(function (classConfigMasters) {
      return res.status(200).send({
          status: "success", 
          school_class_config: school_class_config,
          kits:kits, 
          classes: classConfigMasters});
    });
  } catch(err){
    return res.status(500).send({status:"failure", msg: "An Error occured", err:err.stack})
  }
};

function addSchoolClassConfigMasters() {
  var masters = {};
  return new Promise(function(resolve, reject) {
    ClasseModel.findAll().then(function (classes) {
      resolve(classes);
    });
  });
}

/**
 * Loop through each list
 * Get number of divisions for each classid
 * for each forge based on school, class, division, acadyear...add  received params, add active, save
 * for each beyond the count, forge by id, mark as inactive, save
 * respond success/failure.
 */
exports.addSchoolClassConfig = async function (req, res, next) {
  req.assert('school_id', 'School cannot be blank').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }
  school_class_config = req.body.school_class_config;

  var result = await SchoolModel.forge({ id:req.params.school_id }).save({
    institutional_kits_count: 1,
    institutional_kits_amount: 100000,
    technology_kits_count: 35,
    technology_kits_amount: 10000
  }, {patch:true}).then(function(result){ return result; })
  
  async.each(school_class_config,async function(single_config, callback) {
    try{
      for( var i=0;  i< single_config.divisions; i++){
        let result = await SchoolClassModel.upsert(
          { 
            school_id: req.params.school_id,
            class_id: single_config.class_id,
            division_id: i+1,
            academic_year_id: 1
          }, {
            total_student: single_config.total_student,
            is_enabled: true,
            student_kits:single_config.student_kits,
            assessment:single_config.assessment,
            leadtech:single_config.leadtech
          }, null
        ).then(function(result){ return result; })
      }
      callback();
    } catch(err){
      console.log(err);
      callback();
    }
  }, function(err) {
      if( err ) {
        console.log(err);
      } else {
        return res.status(200).send({status: "success", msg: "School config has been updated."})
      }
  });
};