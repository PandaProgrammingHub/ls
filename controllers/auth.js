var UserDetails = require('../models/userDetails');
var User = require('../models/user');
var userOtp = require('../models/userOtp');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var crypto = require('crypto');
var reqAssert = require('../utils/validatationUtils');
var Communication = require('../config/communication');
var async = require('async');

function generateOTP() {  
  return Math.floor((Math.random() * 8999) + 1000);;
}

function generateToken(user) {
  var payload = {
    iss: 'my.domain.com',
    sub: user.id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET);
}

var findUser = function(mobileNumber) {
  return new Promise(function(resolve, reject){
    resolve(User.findOne({ mobile: mobileNumber }, { require: false }));
  });
};

var addUserDetails = function(req) {
  return new Promise(function(resolve, reject){
    resolve(UserDetails.create({name: req.body.name}));
  });
};

var addUser = function (req, userDetails) {
  return new Promise(function(resolve, reject){
    resolve(
      User.create({
        mobile: req.body.mobile,
        email_id: req.body.email,
        password: req.body.password,
        userdetails_id: userDetails.id,
        status: 'inactive'
      })
    );
  });
};

var addOtp = function (req, user, type) {
  var otpCode = generateOTP();
  var data = {};
  data[user.id] = {"%%OTP_CODE%%": otpCode};
  var commres = Communication.send(req, "VerificationOTP", data);
  console.log(commres);

  return new Promise(function(resolve, reject) {
   resolve(
      userOtp.create({
        otp_code: otpCode,
        user_id: user.id,
        type: type,
        expiredat: new Date(new Date().getTime() + (15*60*1000))
      })
    );
  });
};

var findOtp = function (userId, otp, type) {
  return new Promise(function(resolve, reject){
    resolve(userOtp.findOne({ user_id: userId, otp_code: otp, type: type }, { require: false }));
  });
}

/*function findUser(mobileNumber) {

  return User.findOne({ mobile: mobileNumber }, { require: false });
}*/
/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 22 Nov 2017,
 * @PARAMS: req, res, next
 * if number blank or invalid respond error
 * if name is blank respond error
 * if password is blank respond error
 * if email is bland or invalid respond error
 * Check number is exist or not
 * if number is exist check user status.
 *  if status = active -  do nothing and respond error
 *  if status = deactivated - do nothing and respond error
 *  if status = inactive -
 *    if otp exists in last 15 mins - send same otp
 *    else generate new otp and send
 * if number not exist create user, generate & send otp, take to next page
 */
exports.userSignup = function(req, res, next) {
  // req.assert('mobile', 'Invalid Mobile Number Format').isLength( {min: 10, max:10} );
  // req.assert('email', 'Email is not valid').isEmail();
  // req.assert('email', 'Email cannot be blank').notEmpty();
  // req.assert('password', 'Password cannot be blank').notEmpty();
  req =  reqAssert.validationAssert(req);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  findUser(req.body.mobile)
    .then(function (user) {
      if(!user){
        addUserDetails(req)
          .then(function(userDetails){
            addUser(req, userDetails)
              .then(function(user) {
                addOtp(req, user, 'signup')
                  .then(function (user_otp) {
                    return res.send({success: true, msg: 'Success'});
                  });
              });
          });
      } else {
        if(user.attributes.status === 'active') {
          return res.status(400).send({success: false, msg: 'User already exist'});
        } else if(user.attributes.status === 'deactive') {
          return res.status(400).send({success: false, msg: 'User deactivated'});
        } else if(user.attributes.status === 'inactive') {
          userOtp
            .findOne({ user_id: user.attributes.id, type: 'signup' }, { require: false })
            .then(function(otpDetails){
              if(otpDetails) {
                if( otpDetails.attributes.created_at.valueOf() >=  (new Date(new Date().getTime() - (15*60*1000))).valueOf() ) {
                  //Send same otp to user
                  return res.send({success: true, msg: 'Success'});
                }
              }

              addOtp(req, user, 'signup')
                .then(function (user_otp) {
                  return res.send({success: true, msg: 'Success'});
                });
            });
        }
      }
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 22 Nov 2017,
 * @PARAMS: req, res, next
 * if number blank or invalid respond error
 * if otp is blank respond error
 * Check number and opt against it
 *  if not found - respond error
 *  else if found check the status of that otp
 *    if expired respond error
 *  else
 *    valid respond success
 */
exports.verifyOTP = function(req, res, next){
  req.assert('mobile', 'Invalid Mobile Number Format').isLength( {min: 10, max:10} );
  req.assert('otp', 'Invalid OTP Format').isLength( {min: 4, max: 4} );
  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }
  findUser(req.body.mobile)
    .then(function (user) {
      if (!user) {
        return res.status(400).send({msg: 'User not exist', success: false});
      } else {
        findOtp(user.attributes.id, req.body.otp, 'signup')
          .then(function (otpDetails) {
            if(!otpDetails) {
              return res.status(400).send({msg: 'User and Otp does not match.', success: false});
            } else {
              if( otpDetails.attributes.created_at.valueOf() >=  (new Date(new Date().getTime() - (15*60*1000))).valueOf() ) {
                return res.status(400).send({msg: 'User1 and Otp does not match.', success: false});
              } else {
                user.set('status', 'active');
                user.save(user.changed, { patch: true }).then(function() {
                  return res.status(200).send({ success: true, token: generateToken(user), user: user.toJSON() });
                  //return res.status(200).send({msg: 'Success', success: true});
                });
              }
            }
          });
      }
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 22 Nov 2017,
 * @PARAMS: req, res, next
 * if number blank or invalid respond error
 * if password is blank respond error
 * Check number and password is correct or not
 * if correct row found
 *  if userstatus = active
 *    respond success
 *   else
 *    respond error "deactivated"
 * else
 *  respond inalid phone or password
 */
exports.login = function(req, res, next) {
  req.assert('mobile', 'Invalid Mobile Number Format').isLength( {min: 10, max:10} );
  req.assert('password', 'Password cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  findUser(req.body.mobile)
    .then(function (user) {
      if(!user) {
        return res.status(400).send({success: false, msg: 'User not exist'});
      } else {
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (!isMatch) {
            return res.status(401).send({success: false, msg: 'The password that you\'ve entered is incorrect.'});
          } else {
            if(user.attributes.status === 'active') {
              return res.status(200).send({ success: true, token: generateToken(user), user: user.toJSON() });
            } else if(user.attributes.status === 'deactive') {
              return res.status(400).send({ success: false, msg: 'User deactivated' });
            } else if(user.attributes.status === 'inactive') {
              return res.status(400).send({ success: false, msg: 'User inactive' });
            }
          }
        });
      }
    });
};

/**
 * @AUTHOR: Santosh Panda,
 * @Dated: 22 Nov 2017,
 * @PARAMS: req, res, next
 * if number blank or invalid respond error
 * Check number is exist or not
 * if number not exist respond error
 * if number exist
 *  if userstatus = deactivated
 *    respond error "deactivated"
 *   else if userstatus = inactive
 *    respond error "Your signup process is pending"
 *   else
 *    generate & send otp, take to next page
 */
exports.forgotPassword = function(req, res, next) {
  req.assert('mobile', 'Invalid Mobile Number Format').isLength( {min: 10, max:10} );
  req.assert('mobile', 'Mobile cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }
  findUser(req.body.mobile)
  .then(function (user) {
    if(!user) {
      return res.status(400).send({success: false, msg: 'phone number not exist'});
    } else {
      if(user.attributes.status === 'deactive') {
        return res.status(400).send({success: false, msg: 'user deactivated'});
      } else if(user.attributes.status === 'inactive') {
        return res.status(400).send({success: false, msg: 'your signup process is pending'});
      } else if(user.attributes.status === 'active') {
        addOtp(req, user, 'forgot_password')
        .then(function (user_otp) {
          return res.status(202).send({ success: true, msg: 'successfully otp sent' });
        });
      }
    }
  });

};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 22 Nov 2017,
 * @PARAMS: req, res, next
 * if number, otp, newpassword blank or invalid
 *  respond error
 * if userstatus = deactivated
 *  respond error "deactivated"
 * if otp correct
 *  update password and respond success
 */
exports.forgotPasswordVerify = function(req, res, next){
  req.assert('mobile', 'Invalid Mobile Number Format').isLength( {min: 10, max:10} );
  req.assert('otp', 'Invalid OTP Format').isLength( {min: 4, max: 4} );
  req.assert('password', 'Password cannot be blank').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }
  findUser(req.body.mobile)
    .then(function (user) {
      if (!user) {
        return res.status(400).send({msg: 'User not exist', success: false});
      } else {
        if(user.attributes.status === 'deactive') {
          return res.status(400).send({success: false, msg: 'user deactivated'});
        } else {
          findOtp(user.attributes.id, req.body.otp, 'forgot_password')
            .then(function (otpDetails) {
              if(!otpDetails) {
                return res.status(400).send({msg: 'User and Otp does not match.', success: false});
              } else {
                if( otpDetails.attributes.created_at.valueOf() >=  (new Date(new Date().getTime() - (15*60*1000))).valueOf() ) {
                  return res.status(400).send({msg: 'User and Otp does not match.', success: false});
                } else {
                  user.set('password', req.body.password);
                  user.save(user.changed, { patch: true }).then(function() {
                    return res.status(200).send({msg: 'Success', success: true});
                  });
                }
              }
            });
        }
      }
    });
};

// /**
//  * check for phonenumber not null
//  * ***shift phonnumber on top
//  */
// exports.addUserFromSalesCheckPhonenumber = function(req, res, next){
//
// };

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 22 Nov 2017,
 * @PARAMS: req, res, next
 * check for compulsory fields and validation
 * get all schooluser list for this phonenumber
 * if list empty (new user)
 *  generate otp and send to user.
 *  add user to this school with role
 *  ui says user added and pending account creation
 *  respond success
 * else
 *  if user exists in current schoolid
 *    respond error - user already esist - edit current user
 *  else - add user to this school with role - respond success
 */
exports.addUserFromSales = function(req, res, next){

};

/*
  add user from school dashboard
    by school user (principal/school admin)
    by sales admin or system admin
  // add user from user crud


 */
