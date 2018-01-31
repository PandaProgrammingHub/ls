var crypto = require('crypto');
var bcrypt = require('bcrypt');
var async = require('async');
const UIDGenerator = require('uid-generator');
var UserQueries = require('../queries/user');

exports.comparePassword = async function(simplePass, encryptedPass){
  try{
    var match = await bcrypt.compare(simplePass, encryptedPass).then(function(res) { return res; });
    return match;
  } catch(err){
    console.log(err);
    return false;
  }
}

exports.generateToken = async function(simplePass, encryptedPass){
  try{
    const uidgen = new UIDGenerator(512, UIDGenerator.BASE62);
    var device_token = await uidgen.generate();
    return device_token;
  } catch(err){
    return;
  }
}