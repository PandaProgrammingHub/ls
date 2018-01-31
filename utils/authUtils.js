var User = require('../models/user');
var UserDetails = require('../models/userDetails');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var crypto = require('crypto');
var reqAssert = require('./validatationUtils');
var UserQuery = require('../queries/user');
var knexnest = require('knexnest');
var async = require('async');

exports.isAuthenticated = async function(req, res, next){
    req.isAuthenticated = function() {
        if(req.headers.authorization.includes(" ")){
            var token = req.headers.authorization.split(" ")[1];
        } else {
            var token = req.headers.authorization;
        }
      try {
          return jwt.verify(token, process.env.TOKEN_SECRET);
      } catch (err) {
          return false;
      }
    };

    if (req.isAuthenticated()) {
      var payload = req.isAuthenticated();

      var query = UserQuery.forAuthorization();
      query.where('u.id', payload.sub);
    //   query.limit("1");

      knexnest(query).then(function(results) {
        req.user = results;
        next();
        return true;
      })
      .then(null, function(err) {
        res.status(500).send({success: false, msg: "Could not identify user."});
      });
    } else {
      res.status(401).send({success: false, msg: "Unauthenticated Access"});
    }
}

// exports.generateToken() = function(req, res, next){
    
// }

exports.hasAccessToSchool = function(req, res, next){
    var school_id = req.params.school_id;

    for (var i = 0, len = req.user[0].su.length; i < len; i++) {
        if(req.user[0].su[i].schoolid==school_id){
            next();
            return true;
        }
    }
    res.status(401).send({success: false, msg: "Unauthorized Access"});
}

// exports.hasAccessToSchoolConfig = function(req, res, next){
//     var school_id = req.params.school_id;

//     // if(req.user[0].admin)
    
//     res.status(401).send({success: false, msg: "Unauthorized Access"});
// }