var Schools = require('../../models/school');
var SchoolUsers = require('../../models/schoolUsers');
var formidable = require('formidable');
var fs = require('fs');
var XLSX = require('xlsx');
var Roles = require('../../models/roles');
var Designations = require('../../models/designations');

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 *
 */
exports.addSchoolUsers = function (req, res, next) {
  req.assert('school_id', 'School cannot be blank').notEmpty();
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('role_id', 'Role cannot be blank').notEmpty();
  req.assert('mobile', 'Mobile cannot be blank').notEmpty();
  req.assert('email_id', 'Email cannot be blank').notEmpty();
  req.assert('status', 'Status cannot be blank').notEmpty();
  req.assert('access_till', 'Access till cannot be blank').notEmpty();
  req.assert('designation_id', 'Designation cannot be blank').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  Schools.findOne({id: req.params.school_id}, {require: false})
    .then(function (school_details) {
      if(!school_details) {
        return res.status(200).send({success: false, msg: 'School does not exist.'});
      } else {
        SchoolUsers
          .findOne({school_id: req.params.school_id, mobile: req.body.mobile}, {require: false})
          .then(function (school_usres) {
            if(school_usres) {
              return res.status(400).send({success: false, msg: 'User already exist.'});
            } else {
              req.body.school_id = req.params.school_id;
              SchoolUsers.create(req.body)
                .then(function (user_details) {
                  return res.status(200).send({success: true, user_details: user_details.toJSON()});
                });
            }
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
exports.editSchoolUsers = function (req, res, next) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('role_id', 'Role cannot be blank').notEmpty();
  req.assert('mobile', 'Mobile cannot be blank').notEmpty();
  req.assert('email_id', 'Email cannot be blank').notEmpty();
  req.assert('status', 'Status cannot be blank').notEmpty();
  req.assert('access_till', 'Access till cannot be blank').notEmpty();
  req.assert('designation_id', 'Designation cannot be blank').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }
  SchoolUsers.findOne({id: req.params.id}, {require: false})
    .then(function (school_user_detail) {
      if(!school_user_detail) {
        return res.status(200).send({success: false, msg: 'School User does not exist.'});
      } else {
        SchoolUsers.findOne({school_id: req.params.school_id, mobile: req.body.mobile}, {require: false})
        .then(function (school_user_details) {
        if(school_user_details){               
        return res.status(200).send({success: false, msg: 'user mobile number exits.'});        
        }else{
        // school_user_details.set('name', req.body.name);
        // school_user_details.set('role_id', req.body.role_id);
        // school_user_details.set('mobile', req.body.mobile);
        // school_user_details.set('email_id', req.body.email_id);
        // school_user_details.set('status', req.body.status);
        // school_user_details.set('access_till', req.body.access_till);
        // school_user_details.set('designation', req.body.designation);
        // school_user_details.save(school_user_details.changed, {patch: true})
        //   .then(function (user_details) {
        //     return res.status(200).send({success: true, user: user_details.toJSON()});
        //   });
        req.body.school_id = req.params.school_id;
        SchoolUsers.create(req.body)
          .then(function (user_details) {
            return res.status(200).send({success: true, user_details: user_details.toJSON()});
          });
        }
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
exports.getSchoolUserDetails = function (req, res, next) {
  SchoolUsers.findOne({id: req.params.id}, {require: false})
    .then(function (school_user) {
      if(!school_user) {
        return res.status(200).send({success: false, msg: 'School User does not exist.'});
      } else {
        return res.status(200).send({success: true, user: school_user.toJSON()});
      }
    });
};

exports.uploadSchoolUsers = function (req, res, next) {
  var form = new formidable.IncomingForm();
  var document_url = '';
  form.parse(req, function (err, fields, files) {
    var file = files.file;
    document_url = file.path;

    getUserExcelData(file).then(function (usersData) {
      var i = 0;
      var success = 0;
      var fail = 0;
      var role_id = 1;
      var designation_id = 1;
      usersData.forEach(function (user) {
        i++;
        Roles.findOne({role_name: user.role})
          .then(function (role_details) {
            role_id = role_details.id;
            Designations.findOne({name: user.designation})
              .then(function (designation_details) {
                designation_id = designation_details.id;
                SchoolUsers
                  .findOne({school_id: req.params.school_id, mobile: user.mobile}, {require: false})
                  .then(function (school_usres) {
                    if (school_usres) {
                      fail++;
                      if (i === usersData.length) {
                        return res.status(200).send({success: true, user_success: success, user_fail: fail});
                      }
                    } else {
                      delete user.designation;
                      delete user.role;
                      success++;
                      user.school_id = parseInt(req.params.school_id);
                      user.access_till = new Date(user.access_till);
                      user.role_id = role_id;
                      user.designation_id = designation_id;
                      SchoolUsers.create(user)
                        .then(function (user_details) {
                          if (i === usersData.length) {
                            return res.status(200).send({success: true, user_success: success, user_fail: fail});
                          }
                        });
                    }
                  });
              });
          });
      });
    });
  });
};

function getUserExcelData(file) {
  return new Promise(function (resolve, reject) {
    var workbook = XLSX.readFile(file.path);
    var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(function (y) {
      var worksheet = workbook.Sheets[y];
      var headers = {};
      var data = [];
      for (z in worksheet) {
        if (z[0] === '!') continue;
        //parse out the column, row, and value
        var tt = 0;
        for (var i = 0; i < z.length; i++) {
          if (!isNaN(z[i])) {
            tt = i;
            break;
          }
        };
        var col = z.substring(0, tt);
        var row = parseInt(z.substring(tt));
        var value = worksheet[z].v;

        //store header names
        if (row == 1 && value) {
          headers[col] = value;
          continue;
        }

        if (!data[row]) data[row] = {};
        data[row][headers[col]] = value;
      }
      //drop those first two rows which are empty
      data.shift();
      data.shift();
      resolve(data);
    });
  });
}