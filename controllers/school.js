var Schools = require('../models/school');
var PaymentDetails = require('../models/paymentDetails');
var Documents = require('../models/documents');
var SchoolUsers = require('../models/schoolUsers');
var School_Status = require('../models/schoolStatus');
var formidable = require('formidable');
var fs = require('fs');
var Clusters = require('../models/clusters');
var AcademicYears = require('../models/academicYears');
var SchoolTypes = require('../models/schoolTypes');
var PaymentStatus = require('../models/paymentStatus');
var PaymentType = require('../models/paymentType');
var PaymentMode = require('../models/paymentMode');
var wkhtmltopdf = require('wkhtmltopdf');
var JSZip = require('jszip');
var Docxtemplater = require('docxtemplater');
var path = require('path');
var Agreement = require('../config/agreement');
var async = require('async');

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Check User Logged In or not
 * If loggedIn
 *    check user is admin/salesadmin
 *       If yes
 *          returns the list of all school. If page and limit query parameter present
 *          returns list accordingly. If page and limit parameter not pass
 *          returns first page with default  limit
 *       else
 *          respond error
 *  else
 *    respond error
 */
exports.salesList = function (req, res, next) {
  var page = 1;
  var pageSize = 100;

  if (req.query.page) {
    page = req.query.page;
  }

  if (req.query.pageSize) {
    pageSize = req.query.pageSize;
  }

  Schools
    .query(function (qb) {
      if (req.query.name) {
        qb.where('name', 'ilike', '%' + req.query.name + '%');
      }
      if (req.query.code) {
        qb.where('code', 'ilike', '%' + req.query.code + '%');
      }
      if (req.query.location) {
        qb.where('city', 'ilike', '%' + req.query.location + '%');
      }
      if (req.query.status) {
        qb.where('school_status_id', '=', req.query.status);
      }
      if (req.query.pincode) {
        qb.where('pincode_id',  '=', req.query.pincode );
      }
    })
    .orderBy('name',  'ASC')
    .fetchPage({
      pageSize: pageSize,
      page: page,
      withRelated: ['payments', 'Type', 'Status', 'Cluster', 'documents']
    })
    .then(items => {
      items = items.toJSON();
      if(items.length === 0) {
        return res.status(200).send({ success: false, msg: 'No School Found, Try another search' });
      } else {
        return addPaymentStatus(items).then(function (paymentsItems) {
          return addDocumentStatus(paymentsItems).then(function (documentsItems) {
            var schoolsData = documentsItems;
            return addSchoolMasters(items)
              .then(function (masters) {
                return res.status(200).send({ success: true, schools: schoolsData, masters: masters });
              });
          });
        });
      }
    })
    .catch(function (err) {
      console.log(err);
      return res.status(400).send({success: false, msg: 'No school found'});
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Check User Logged In or not
 * If loggedIn
 *    check user is admin/salesadmin
 *       If yes
 *          returns the list of all school. If page and limt query parameter present
 *          returns list accordingly. If page and limit parameter not pass
 *          returns first page with default  limit
 *       else
 *          respond error
 *  else
 *    respond error
 */
exports.userList = function (req, res, next) {
  SchoolUsers
    .query(function (qb) {
      if (req.query.mobile) {
        qb.where('mobile', '=', req.query.mobile);
      }
    })
    .fetchAll()
    .then(function (users) {
      if (!users) {
        return res.status(200).send({ success: true, msg: 'School is not assigned' });
      }
      var school_ids = [];
      users.forEach(function (user) {
        school_ids.push(user.attributes.school_id);
      });
      Schools
        .query(function (qb) {
          if (school_ids.length > 0) {
            qb.whereIn('id', school_ids);
          }
        })
        .fetchAll({
          withRelated: ['payments', 'Type', 'Status', 'Cluster']
        })
        .then(function (items) {
          addPaymentStatus(items).then(function (paymentsItems) {
            addDocumentStatus(paymentsItems).then(function (documentsItems) {
              var schoolsData = documentsItems;
              addSchoolMasters(items)
                .then(function (masters) {
                  return res.status(200).send({ success: true, schools: schoolsData, masters: masters });
                });
            });
          });
        });
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 * Check User Logged In or not
 * If loggedIn
 *    check user is admin/salesadmin
 *       If yes
 *          check school exist
 *            If yes
 *              deactivate the school
 *            else
 *              respond error
 *       else
 *          respond error
 *  else
 *    respond error
 */
exports.deactivate = function (req, res, next) {
  Schools.findOne({ id: req.params.id })
    .then(function (schoolData) {
      if (!schoolData) {
        return res.status(400).send({ success: false, msg: 'School does not exist.' });
      } else {
        School_Status.findOne({ name: 'Inactive' })
          .then(function (school_status) {
            if (school_status) {
              schoolData.set('school_status_id', school_status.id);
              schoolData.save(schoolData.changed, { patch: true })
                .then(function (updatedSchoolData) {
                  return res.status(200).send({ success: true, school: updatedSchoolData.toJSON() });
                });
            }
          });
      }
    });
};
/**
 * @AUTHOR: Santosh Kumar Panda,
 * @Dated: 29 Jan 2018,
 * @PARAMS: req, res, next
 * Check User Logged In or not
 * If loggedIn
 *    check user is admin/salesadmin
 *       If yes
 *          check school exist
 *            If yes
 *              Active the school
 *            else
 *              respond error
 *       else
 *          respond error
 *  else
 *    respond error
 */
exports.activate = function (req, res, next) {
  Schools.findOne({ id: req.params.id })
    .then(function (schoolData) {
      if (!schoolData) {
        return res.status(400).send({ success: false, msg: 'School does not exist.' });
      } else {
        School_Status.findOne({ name: 'Active' })
          .then(function (school_status) {
            console.log(school_status);
            if (school_status) {
              schoolData.set('school_status_id', school_status.id);
              schoolData.save(schoolData.changed, { patch: true })
                .then(function (updatedSchoolData) {
                  return res.status(200).send({ success: true, school: updatedSchoolData.toJSON() });
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
 * Check User Logged In or not
 * If loggedIn
 *    check school exist
 *      If yes
 *        returns school details
 *      else
 *        respond error
 *  else
 *    respond error
 */
exports.getInfo = function (req, res, next) {
  Schools.findOne({ id: req.params.id })
    .then(function (school_details) {
      return res.status(200).send({ success: true, school: school_details.toJSON() });
    });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 *
 */
exports.getDocuments = function (req, res, next) {
  Schools.findOne({ id: req.params.id }, { require: false })
    .then(function (school_details) {
      if (!school_details) {
        return res.status(400).send({ success: false, msg: 'School does not exist.' });
      } else {
        Documents.findAll({ school_id: req.params.id })
          .then(function (document_details) {
            return res.status(200).send({ success: true, document_details: document_details.toJSON() });
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
exports.addDocuments = function (req, res, next) {
  var form = new formidable.IncomingForm();
  var document_url = '';
  form.parse(req, function (err, fields, files) {
    var file = files.file;
    document_url = file.path;
    fs.readFile(file.path, function (err, data) {
      Schools.findOne({ id: req.params.id }, { require: false })
        .then(function (school_details) {
          if (!school_details) {
            return res.status(400).send({ success: false, msg: 'School does not exist.' });
          } else {
            var params = {};
            params.school_id = req.params.id;
            params.doc_id = fields.doc_id;
            params.document_type = fields.document_type;
            params.document_url = document_url;

            Documents.create(params)
              .then(function (documents_details) {
                return res.status(200).send({ success: true, documents_details: documents_details.toJSON() });
              });
          }
        });
    });
  });


  /*req.assert('doc_id', 'document id cannot be blank').notEmpty();
  req.assert('document_type', 'document type cannot be blank').notEmpty();
  req.assert('document_url', 'document url cannot be blank').notEmpty();
  // console.log(req.body);
  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }*/


};


/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 *
 */
exports.addPayments = function (req, res, next) {
  req.assert('payment_type_id', 'payment type cannot be blank').notEmpty();
  req.assert('amount', 'amount cannot be blank').notEmpty();
  req.assert('status_id', 'status cannot be blank').notEmpty();
  req.assert('due_date', 'status cannot be blank').notEmpty();
  req.assert('comment', 'comment cannot be blank').notEmpty();
  req.assert('pay_mode_id', 'mode cannot be blank').notEmpty();
  req.assert('invoice_date', 'Invoice date cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  Schools.findOne({ id: req.params.id }, { require: false })
    .then(function (school_details) {
      if (!school_details) {
        return res.status(400).send({ success: false, msg: 'School does not exist.' });
      } else {
        var invoiceNumber = 'LDS-' + Math.floor(Math.random() * 10000000000);
        var params = {};
        params.school_id = req.params.id;
        params.payment_type_id = req.body.payment_type_id;
        params.amount = req.body.amount;
        params.status_id = req.body.status_id;
        params.due_date = req.body.due_date;
        params.comment = req.body.comment;
        params.pay_mode_id = req.body.pay_mode_id;
        params.invoices_no = invoiceNumber;
        params.invoice_date = req.body.invoice_date;

        PaymentDetails.create(params)
          .then(function (payment_details) {
            return res.status(200).send({ success: true, payment_details: payment_details.toJSON() });
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
exports.getPayments = function (req, res, next) {
  Schools.findOne({ id: req.params.id }, { require: false })
    .then(function (school_details) {
      if (!school_details) {
        return res.status(400).send({ success: false, msg: 'School does not exist.' });
      } else {
        PaymentDetails.findAll({ school_id: req.params.id })
          .then(function (payment_details) {
            addSchoolPaymentMasters().then(function (masterData) {
              return res.status(200).send({
                success: true,
                payment_details: payment_details.toJSON(),
                masters: masterData
              });
            });
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
exports.editPayments = function (req, res, next) {
  return res.status(200).send({ success: true, msg: 'get editPayments' });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 *
 */
exports.updatePaymentStatus = function (req, res, next) {
  return res.status(200).send({ success: true, msg: 'updatePaymentStatus' });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 *
 */
exports.getSchoolUsers = function (req, res, next) {
  Schools.findOne({ id: req.params.id }, { require: false })
    .then(function (school_details) {
      if (!school_details) {
        return res.status(400).send({ success: false, msg: 'School does not exist.' });
      } else {
        SchoolUsers.findAll({ school_id: req.params.id })
          .then(function (users_details) {
            return res.status(200).send({ success: true, users_details: users_details.toJSON() });
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
exports.addSchoolUsers = function (req, res, next) {
  return res.status(200).send({ success: true, msg: 'addSchoolUsers' });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 *
 */
exports.editSchoolUsers = function (req, res, next) {
  return res.status(200).send({ success: true, msg: 'editSchoolUsers' });
};

/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 *
 */
exports.addSchool = function (req, res, next) {
  var coverImage = '',coverImaageString;
  var coverImgArray;
  var logoImgArray;
  var logo = '',logoString;
  const uploadDir = path.join(__dirname,  '../public/uploads/');
  var form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.uploadDir = uploadDir;
  form.parse(req, function (err, fields, files) {
    validateSchoolData(fields, res).then(function () {
      if(files !== undefined) {
        if(files.coverImage !== undefined) {
          coverImaageString = files.coverImage.path;
          coverImgArray = coverImaageString.split('/');
          coverImage = '/uploads/'+coverImgArray[coverImgArray.length -1];
        }
        if(files.logo !== undefined) {
          logoString = files.logo.path;
          logoImgArray = logoString.split('/');
          logo = '/uploads/'+logoImgArray[logoImgArray.length -1];
        }
      }

      var schoolParams = {};
      schoolParams.name = fields.name;
      schoolParams.address_line1 = fields.address1;
      schoolParams.cluster_id = fields.cluster;
      schoolParams.admin_telephone = fields.admin_mobile;
      schoolParams.acadminc_year_id = fields.acadyear;
      schoolParams.estabished = fields.established;
      schoolParams.telephone2 = fields.home_phone;
      schoolParams.pincode_id = fields.pincode;
      schoolParams.email = fields.email;
      schoolParams.website = fields.website;
      schoolParams.address_line2 = fields.address2;
      schoolParams.mission = fields.mission;
      schoolParams.vision = fields.vision;
      schoolParams.year_book = fields.yearBook;
      schoolParams.news_paper = fields.newspaper;
      schoolParams.city = fields.city;
      schoolParams.state = fields.state;
      schoolParams.chain = fields.school_chain;
      schoolParams.school_type_id = fields.school_type;
      schoolParams.school_status_id = 1;
      schoolParams.cover_img = coverImage;
      schoolParams.logo = logo;

      Schools.create(schoolParams)
        .then(function (schoolDetails) {
          return res.status(200).send({success: true, school: schoolDetails.toJSON()});
        })
        .catch(function (err) {
          return res.status(400).send({success: false, msg: err});
          /*uploadSchoolLogo(files).then(function (logo_url) {
            school_logo = logo_url;
            uploadSchoolCoverImage(files).then(function (cover_image_url) {
            cover_img = cover_image_url;
            schoolDetails.set('cover_img', cover_img);
            schoolDetails.set('logo', school_logo);
            schoolDetails.save(schoolDetails.changed, {patch: true})
              .then(function (updatedSchoolData) {
                    return res.status(200).send({success: true, school: updatedSchoolData.toJSON()});
                });
              });
            });*/
        });
    });
  });
};


/**
 * @AUTHOR: Kiran Mate,
 * @Dated: 29 Nov 2017,
 * @PARAMS: req, res, next
 *
 */
exports.updateSchool = function (req, res, next) {
  var coverImage = '';
  var logo = '';
  const uploadDir = path.join(__dirname,  '../uploads/');
  var form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.uploadDir = uploadDir;
  form.parse(req, function (err, fields, files) {
    validateSchoolData(fields, res).then(function () {
      Schools.findOne({ id: req.params.id })
        .then(function (schoolData) {
          if (!schoolData) {
            return res.status(400).send({ success: false, msg: 'School does not exist.' });
          } else {
            if(files !== undefined) {
              if(files.coverImage !== undefined) {
                coverImage = files.coverImage.path;
              }
              if(files.logo !== undefined) {
                logo = files.logo.path;
              }
            }

            schoolData.set('name', fields.name);
            schoolData.set('address_line1', fields.address1);
            schoolData.set('cluster_id', fields.cluster);
            schoolData.set('admin_telephone', fields.admin_mobile);
            schoolData.set('acadminc_year_id', fields.acadyear);
            schoolData.set('estabished', fields.established);
            schoolData.set('telephone2', fields.home_phone);
            schoolData.set('pincode_id', fields.pincode);
            schoolData.set('email', fields.email);
            schoolData.set('website', fields.website);
            schoolData.set('address_line2', fields.address2);
            schoolData.set('mission', fields.mission);
            schoolData.set('vision', fields.vision);
            schoolData.set('year_book', fields.yearBook);
            schoolData.set('news_paper', fields.newspaper);
            schoolData.set('city', fields.city);
            schoolData.set('state', fields.state);
            schoolData.set('chain', fields.school_chain);
            schoolData.set('school_type_id', fields.school_type);
            schoolData.set('cover_img', coverImage);
            schoolData.set('logo', logo);

            schoolData.save(schoolData.changed, { patch: true })
              .then(function (updatedSchoolData) {
                return res.status(200).send({ success: true, school: updatedSchoolData.toJSON() });
              });
          }
        });
    });
  });
};
/**
 * @AUTHOR: Santosh Kumar Panda,
 * @Dated: 16 Jan 2018,
 * @PARAMS: req, res, next
 *
 */
exports.downloadAgreementDocument = function (req, res, next) {
  Schools.findOne({ id: req.params.school_id }, { require: false })
    .then(function (school_details) {
      if (!school_details) {
        return res.status(400).send({ success: false, msg: 'School does not exist.' });
      } else {
        var school_info = school_details.toJSON();
        var school_address = school_info.address_line1+','+school_info.address_line2;
        //var today = new Date().toJSON();
        var today = new Date().toISOString().slice(0,10);
        console.log(today);
        //Load the docx file as a binary
        var content = fs
          .readFileSync(path.resolve(__dirname, '../agreement_docs/sample_agreement.docx'), 'binary');

        var zip = new JSZip(content);

        var doc = new Docxtemplater();
        doc.loadZip(zip);
        var schoolClassConfig = [
          {
            "class"                :"NURSERY",
            "no_of_divisions"      :"5",
            "total_no_of_students" :"10",

          },
          {
            "class"                :"JKG",
            "no_of_divisions"      :"10",
            "total_no_of_students" :"20",

          },                      
          {
            "class"                :"SKG",
            "no_of_divisions"      :"15",
            "total_no_of_students" :"30",

          },                                
          {
            "class"                :"1",
            "no_of_divisions"      :"20",
            "total_no_of_students" :"40",

          },
          {
            "class"                :"2",
            "no_of_divisions"      :"25",
            "total_no_of_students" :"50",

          },
        ];

        //set the templateVariables
        doc.setData({
          school_name       : school_info.name,
          effective_date    : today,
          school_location   : school_info.city,
          school_address    : school_address,
          cin_number        : "xxx123456xxx",
          no_of_days        : Agreement.no_of_days,
          schoolClassConfig : schoolClassConfig,
        });

        try {
          // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
          doc.render()
        }
        catch (error) {
          var e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
          }
          console.log(JSON.stringify({ error: e }));
          // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
          throw error;
        }

        var buf = doc.getZip()
          .generate({ type: 'nodebuffer' });

        // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
        fs.writeFileSync(path.resolve(__dirname, '../agreement_docs/LEAD_School_And_'+school_info.name+'_Partnership_Agreement.docx'), buf);
        wkhtmltopdf(
          function (err, stream) {
            return res.download('agreement_docs/LEAD_School_And_'+school_info.name+'_Partnership_Agreement.docx');
          });
        //fs.unlink(path.resolve(__dirname, '../output.docx'));
    }
    });
};

function addSchoolMasters(data) {
  var masters = {};
  return new Promise(function (resolve, reject) {
    Clusters.findAll().then(function (clusters) {
      masters.clusters = clusters.toJSON();
      AcademicYears.findAll().then(function (academicYears) {
        masters.academicYears = academicYears.toJSON();
        SchoolTypes.findAll().then(function (schoolTypes) {
          masters.schoolTypes = schoolTypes.toJSON();
          resolve(masters);
        });
      });
    });
  });
}

function getPaymentStatus(statusItems) {
  return new Promise(function (resolve, reject) {
    var status = 'Complete';
    var i = 0;
    statusItems.forEach(function (item) {
      i++;
      var currentDate = new Date();
      var dueDate = new Date(item.due_date);
      if (dueDate < currentDate) {
        status = 'Pending';
      }
      if (i === statusItems.length) {
        resolve(status);
      }
    });
  });
}

function addPaymentStatus(data) {
  return new Promise(function (resolve, reject) {
    var schoolsData = [];
    var increment = 0;
    data.forEach(function (item) {
      increment++;
      if (item.payments.length > 0) {
        getPaymentStatus(item.payments).then(function (paymentStatus) {
          item.paymentstatus = paymentStatus;
          schoolsData.push(item);
        });
      } else {
        item.paymentstatus = 'Pending';
        schoolsData.push(item);
      }
      if (increment === data.length) {
        resolve(schoolsData);
      }
    });
  });
}

function getDocumentStatus(statusItems) {
  return new Promise(function (resolve, reject) {
    var status = 'Complete';
    var i = 0;
    statusItems.forEach(function (item) {
      i++;
      if (i === statusItems.length) {
        resolve(status);
      }
    });
  });
}

function addDocumentStatus(data) {
  return new Promise(function (resolve, reject) {
    var schoolsData = [];
    var increment = 0;
    data.forEach(function (item) {
      increment++;
      if (item.documents.length > 0) {
        getDocumentStatus(item.documents).then(function (documentStatus) {
          item.documentstatus = documentStatus;
          schoolsData.push(item);
        });
      } else {
        item.documentstatus = 'Pending';
        schoolsData.push(item);
      }
      if (increment === data.length) {
        resolve(schoolsData);
      }
    });
  });
}

function addSchoolPaymentMasters() {
  var masters = {};
  return new Promise(function (resolve, reject) {
    PaymentStatus.findAll().then(function (paymentsStatus) {
      masters.paymentsStatus = paymentsStatus.toJSON();
      PaymentType.findAll().then(function (paymentTypes) {
        masters.paymentTypes = paymentTypes.toJSON();
        PaymentMode.findAll().then(function (paymentModes) {
          masters.paymentModes = paymentModes.toJSON();
          resolve(masters);
        });
      });
    });
  });
}

function validateSchoolData(school, res) {
  return new Promise(function (resolve, reject) {
    console.log("step 0");
    if (school.acadyear.length === 0) {
      return res.status(400).send({ success: false, msg: 'Academic Year cannot be blank' });
    console.log("step 1");
    
    }
    if (school.address1.length === 0) {
      return res.status(400).send({ success: false, msg: 'Address1 cannot be blank' });
    console.log("step 2");
    
    }
    if (school.address2.length === 0) {
      return res.status(400).send({ success: false, msg: 'Address2 cannot be blank' });
    }
    if (school.city.length === 0) {
      return res.status(400).send({ success: false, msg: 'City cannot be blank' });
    }
    if (school.cluster.length === 0) {
      return res.status(400).send({ success: false, msg: 'Cluster cannot be blank' });
    }
    if (school.email.length === 0) {
      return res.status(400).send({ success: false, msg: 'email cannot be blank' });
    }
    if (school.established.length === 0) {
      return res.status(400).send({ success: false, msg: 'Established cannot be blank' });
    }
    if (school.home_phone.length === 0) {
      return res.status(400).send({ success: false, msg: 'home_phone cannot be blank' });
    }
    if (school.mission.length === 0) {
      return res.status(400).send({ success: false, msg: 'mission cannot be blank' });
    }
    if (school.name.length === 0) {
      return res.status(400).send({ success: false, msg: 'Name cannot be blank' });
    }
    if (school.newspaper.length === 0) {
      return res.status(400).send({ success: false, msg: 'newspaper cannot be blank' });
    }
    if (school.pincode.length === 0) {
      return res.status(400).send({ success: false, msg: 'pincode cannot be blank' });
    }
    if (school.school_chain.length === 0) {
      return res.status(400).send({ success: false, msg: 'school_chain cannot be blank' });
    }
    if (school.school_type.length === 0) {
      return res.status(400).send({ success: false, msg: 'school_type cannot be blank' });
    }
    if (school.state.length === 0) {
      return res.status(400).send({ success: false, msg: 'state cannot be blank' });
    }
    if (school.vision.length === 0) {
      return res.status(400).send({ success: false, msg: 'vision cannot be blank' });
    }
    if (school.website.length === 0) {
      return res.status(400).send({ success: false, msg: 'website cannot be blank' });
    }
    if (school.yearBook.length === 0) {
      return res.status(400).send({ success: false, msg: 'yearBook cannot be blank' });
    }
    resolve(true);
  });
}


function uploadSchoolLogo(fileObj) {
  return new Promise(function (resolve, reject) {
    var logoUrl = '';
    if (fileObj.logo) {
      fs.readFile(fileObj.logo.path, function (err, data) {
        logoUrl = fileObj.logo.path;
        resolve(logoUrl);
      });
    } else {
      resolve(logoUrl);
    }
  });
}

function uploadSchoolCoverImage(fileObj) {
  return new Promise(function (resolve, reject) {
    var coverImageUrl = '';
    if (fileObj.coverImage) {
      fs.readFile(fileObj.coverImage.path, function (err, data) {
        coverImageUrl = fileObj.coverImage.path;
        resolve(coverImageUrl);
      });
    } else {
      resolve(coverImageUrl);
    }
  });
}