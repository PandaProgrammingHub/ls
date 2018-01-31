var dotenv = require('dotenv');
var async = require('async');
var request = require("request");

var CommunicationTemplate = require('../models/communicationTemplates');
dotenv.load();
var UserModel = require('../models/user');
var UserQuery = require('../queries/user');
var ModelUtils = require('../utils/modelUtils');

var api_key = process.env.MAILGUN_APIKEY;
var domain =  process.env.MAILGUN_DOMAIN;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var from = process.env.MAILGUN_FROM;

//get the req, communication name, recepient user ids & data combo, recepient emails & data combi to be sent.
//if getting userids, get the user emails from it
//get the communication settings from commname
//replace the variables from message bodies
//sent email,sms,notification and log each

function replaceDefaults(content, contact){
  var defaultsOfSystem = { '%%COMPANY_NAME%%': 'Lead School', '%%COMPANY_ADDRESS%%': 'Some Address and street etc' };
  var defaultsOfUser = { '%%USER_NAME%%' : contact.name, '%%USER_EMAIL%%': contact.email_id }

  if(!content)
    return content;

  for(var variable in defaultsOfSystem){
    content = content.replace(variable, defaultsOfSystem[variable]);
  }

  for(var variable in defaultsOfUser){
    content = content.replace(variable, defaultsOfUser[variable]);
  }
  return content;
}

exports.send = async function(req, communicationName, data){
  var comm = {};

  let getCommunicationTempaltes = function() {
    return new Promise(function(resolve, reject)  {
      CommunicationTemplate.findOne({name: communicationName}, {require: true})
      .then(function(template){
        comm.template = template;
        resolve(comm);
      })
      .catch(function(err){
        reject(err);
      })

    });
  };

  let createObjectsForSending = function(comm) {
    return new Promise(function(resolve, reject)  {
      comm.emailItems = [];
      comm.smsItems = [];
      // var androidNotificationItems = [];
      // var iosNotificationItems =  [];
      var userArray = [];

      for(var obj in data){ userArray.push(obj); }
      
      var userList = null;
      UserModel.forge().where('id', 'in', userArray).fetchAll({withRelated: 'userDetails'})
      .then(function(userList){
        console.log(userList);
        for(var obj in data){
          //console.log(data[obj]);
          var newContents = {};
          newContents.emailSubject = comm.template.attributes.email_subject;
          newContents.emailContent = comm.template.attributes.email_content;
          newContents.smsContent = comm.template.attributes.sms_content;
          newContents.androidSubject = comm.template.attributes.notification_android_subject;
          newContents.androidContent = comm.template.attributes.notification_android_content;
          newContents.iosContent = comm.template.attributes.notification_ios_content;
          
          var contact = ModelUtils.getUserContactsFromUserListAndUserID(obj, userList);

          newContents.emailSubject = replaceDefaults(newContents.emailSubject, contact);
          newContents.emailContent = replaceDefaults(newContents.emailContent, contact);
          newContents.smsContent = replaceDefaults(newContents.smsContent, contact);
          newContents.androidSubject = replaceDefaults(newContents.androidSubject, contact);
          newContents.androidContent = replaceDefaults(newContents.androidContent, contact);
          newContents.iosContent = replaceDefaults(newContents.iosContent, contact);

          for(var obj2 in data[obj]){
            // TODO checking that obj2 has %% to ensure nothing normal gets replaced
            if(newContents.emailSubject) newContents.emailSubject= newContents.emailSubject.replace( obj2, data[obj][obj2]);
            if(newContents.emailContent) newContents.emailContent = newContents.emailContent.replace( obj2,data[obj][obj2]);
            if(newContents.smsContent) newContents.smsContent = newContents.smsContent.replace( obj2,data[obj][obj2]);
            if(newContents.androidSubject) newContents.androidSubject = newContents.androidSubject.replace( obj2,data[obj][obj2]);
            if(newContents.androidContent) newContents.androidContent = newContents.androidContent.replace( obj2,data[obj][obj2]);
            if(newContents.iosContent) newContents.iosContent = newContents.iosContent.replace( obj2,data[obj][obj2]);
          }
  
          var emailItem = {
            from: from,
            to: contact.email_id,
            subject: newContents.emailSubject,
            html: newContents.emailContent
          };

          var smsItem = 
            { 
              method: 'POST',
              url: process.env.SMS_APIURL,
              headers: {
                'api-key': process.env.SMS_APIKEY
              },
              body: { 
                sender: process.env.SMS_SENDERNAME,
                recipient: "91"+contact.mobile,
                content: newContents.smsContent,
                type: 'transactional',
                tag: communicationName,
                webUrl: 'leadschool.in' 
              },
              json: true 
            };
  
          comm.emailItems.push(emailItem);
          comm.smsItems.push(smsItem);
          console.log(comm.smsItems);
        }
        resolve(comm);
      })
      .catch(function(err){
          reject(err);
      })
    });
  };

  let sendEmails = function(comm){
    return new Promise(function(resolve, reject)  {
      if(comm.template.attributes.email_isactive == "0"){
        return resolve(comm);
      }
      comm.emailStatus = "Success";
      async.each(comm.emailItems, function(emailItem, callback) {
        mailgun.messages().send(emailItem, function (error, body) {
          if(error){
            comm.emailStatus = "Failure"
          }
          req.log.info({category: "Communication", subcategory: "Email",
          extrequest: emailItem, extresponse: body, failure: error});
        });
          callback();
        }, function(err) {
          if( err ) {
            comm.emailStatus = "Failure";
            resolve(comm);
          } else {
            resolve(comm);
          }
      });
    });
  }

  let sendSMSes = function(comm){
    return new Promise(function(resolve, reject)  {
      if(comm.template.attributes.sms_isactive == "0"){
        return resolve(comm);
      }
      comm.smsStatus = "Success";
      async.each(comm.smsItems, function(smsItem, callback) {
        request(smsItem, function (error, response, body) {
          req.log.info({category: "Communication", subcategory: "SMS",
          extrequest: smsItem, extresponse: body, failure: error});
          });
        callback();
        }, function(err) {
          if( err ) {
            comm.smsStatus = "Failure";
            resolve(comm);
          } else {
            resolve(comm);
          }
      });
    });
  }

  var responsedata = await new Promise(function (resolve, reject) {
    getCommunicationTempaltes(communicationName)
    .then(createObjectsForSending)
    .then(sendEmails)
    .then(sendSMSes)
    // .then(sendNotifications)
    .then(function(comm){
      return resolve(comm);
    })
    .catch(function(err){
      return reject(comm);
    })
  });

  return responsedata;
}