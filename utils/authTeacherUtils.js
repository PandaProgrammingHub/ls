var User = require('../models/user');
var UserDetails = require('../models/userDetails');
var moment = require('moment');
var reqAssert = require('./validatationUtils');
var UserQuery = require('../queries/user');
var knexnest = require('knexnest');
var async = require('async');

exports.teacherIsAuthenticatedForSchool = async function(req, res, next){

  try{
    if( req.headers.device_token == null || 
        req.headers.device_id == null || 
        req.headers.school_id == null, 
        req.headers.schooluser_id == null){
      return res.status(400).send({ status: "failure", msg: "Invalid Request" });
    }

    var query = UserQuery.forAuthorization();
    query.where({ 
      'su.device_id': req.headers.device_id,
      'su.device_token': req.headers.device_token,
      'su.school_id': req.headers.school_id,
      'su.id': req.headers.schooluser_id,
      'su.isLoggedIn': "1"
    });
    query.whereIn('sur.role_name', ["Teacher", "Principal", "Admin"]);
    query.limit("1");
    query.orderBy('su.id','DESC')

    let user = knexnest(query).then(function(user){return user});

    if(!user || 
      user[0].status != "active" || 
      (user[0].su[0].accesstill < new Date(moment.now()) && user[0].su[0].status != "1") || 
      user[0].su[0].devicetoken == null ){
        return res.status(400).send({ status: "failure", msg: "Invalid Session" });
    }

    next();
    return true;
  
  }catch(err){
    console.log(err);
    return res.status(500).send({ status: "failure", msg: "Internal Error" });
    return false;
  }
}