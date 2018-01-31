var UserModel = require('../../models/user');
var SchoolUserModel = require('../../models/schoolUsers');
var UserQueries = require('../../queries/user');
var knexnest = require('knexnest');
var moment = require('moment');
var async = require('async');
var dotenv = require('dotenv');
var TeacherServiceUtils = require('../../utils/teacherServiceUtils');

dotenv.load();

/*
  Check if server is working
*/
exports.status = function (req, res, next) {
  res.status(200).send({ status:"success" });
};


/*

  Req - mobilenumber, password
  Res - status, authtoken

  get user from mobile, where role is [teacher, princpal, admin]
  if no user found respond error
  if bypasspassword then skip login
  authenticate password
  if user is not active respond error
  if schooluser doesnt have access as of today or status is inactive respond error
  if device token is not present (first time login)
    generate token, save device_id, devicetoken, isLoggedin and respond success with token and user
  else if device_id is same
    respond success with token and user
  else
    if confirmChangeDevice = false - respond with error msg and confirmChangeDevice = true setting form
    else generate token, save device_id, devicetoken, isLoggedin and respond success with token and user
  
*/
exports.login = async function (req, res, next) {

  req.assert('mobilenumber', 'Invalid mobile number').isLength( {min: 10, max:10} ).isNumeric();
  req.assert('password', 'Invalid request').notEmpty();
  if(req.headers.device_id == "" || req.headers.device_id == null) {
    return res.status(400).send({ success: false, msg: 'Invalid request' });
  }
  
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  var query = UserQueries.forAuthorization();
  query.where('u.mobile', req.body.mobilenumber);
  query.whereIn('sur.role_name', ["Teacher", "Principal", "Admin"]);
  query.limit("1");
  query.orderBy('su.id','DESC')

  try {
    let user = await knexnest(query).then(function(user){ return user; });
    if(!user){
      return res.status(200).send({ status:"failure", msg:"Invalid mobile number or password" });
    } 
    if (req.body.password != process.env.PASS_TEACHER_BYPSS){
      let compare = await TeacherServiceUtils.comparePassword(req.body.password, user[0].password);
      if (compare != true){
        return res.status(200).send({ status:"failure", msg:"Invalid mobile number or password" });
      }
    }
    if(user[0].status != "active"){
      return res.status(200).send({ status:"failure", msg:"User account is not active" });
    } 
    if(user[0].su[0].accesstill < new Date(moment.now()) || user[0].su[0].status != "1"){
      return res.status(200).send({ status:"failure", msg:"Teacher account is not active" });
    }
    if(user[0].su[0].devicetoken == null){
      try{
        let device_token = await TeacherServiceUtils.generateToken();
        if(!device_token){
          return res.status(500).send({ status:"failure", msg:"Internal Error" });
        }
        await SchoolUserModel.forge({ id: user[0].su[0].id }).save({ 
          device_id : req.headers.device_id,
          device_token: device_token,
          isLoggedIn: 1
        }).then(function(result){
          return result;
        });
        delete user[0].password;
        return res.status(200).send({status: "success", token: device_token, teacher:user });
      }catch(err){
        console.log(err);
        return res.status(500).send({status: "failure", msg: "Teacher Login Failed.", err:err});
      }
    } 
    if(user[0].su[0].device_id == req.headers.device_id){
      delete user[0].password;
      return res.status(200).send({status: "success", token: user[0].su[0].devicetoken, teacher:user});
    } else {
        if(req.body.confirmChangeDevice == "true"){
          let device_token = await TeacherServiceUtils.generateToken();
          if(!device_token){
            return res.status(500).send({ status:"failure", msg:"Internal Error" });
          }
          await SchoolUserModel.forge({ id: user[0].su[0].id }).save({ 
            device_id : req.headers.device_id,
            device_token: device_token,
            isLoggedIn: 1
          }).then(function(result){
            return result;
          });
          delete user[0].password;
          return res.status(200).send({status: "success", token: device_token, teacher:user });
        } else {
          return res.status(200).send({status: "failure", askConfirm: true, msg: "You are already logged in from another tablet. If you continue login you will not be able to sync data from old tablet. Please confirm. "});
        }
    }
    return res.status(200).send({ status:"failure", msg: "Invalid Account" });
  } catch(err){
    console.log(err);
    return res.status(500).send({ status:"failure", err:err });
  }
};


/*
  UpdateContent SVC
  Req - suid, token, mobilenumber, password
  Res - Classes, Subjects, Divisions, StudentList(withDOB), Units (LO, ASMSs, DPs, ResourceList) - ZIPPED

  get classes-division+subject combination for teacher in that school
  get student list for each division
  get unit list for each division
  get loslis, asms, dps, resources for each unit
  
  get combined json object
  zip the contents and sent to user.

*/
exports.updateContent = function (req, res, next) {
  
};


/*
  UpdateCalender
    Req - suid, token
    Res - Calender Items
*/
exports.updateCalender = function (req, res, next) {
  res.status(200).send({ status:"success" });
};


/*
  UpdateStudentList
    Req - suid, token
    Res - StudentList(withDOB)
*/
exports.updateStudentList = function (req, res, next) {
  res.status(200).send({ status:"success" });
};


/*
  syncData
    Req - suid, token, data{plans, units, asmstatus, asmscores, attendance, mediaList}
    Res - status
*/
exports.syncData = function (req, res, next) {
  res.status(200).send({ status:"success" });
};
