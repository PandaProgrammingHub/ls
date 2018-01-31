var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var modelBase = require('../config/bookshelf');
var UserDetails = require('./userDetails');
var SchoolUsersModel = require('./schoolUsers')
var CommunicationTemplates = require('./communicationTemplates');

var User = modelBase.extend({
  tableName: 'users',
  hasTimestamps: true,

  userDetails: function(){
    return this.belongsTo(UserDetails, "userdetails_id", "id");
  },

  school_users: function(){
    return this.hasMany(SchoolUsersModel);
  },

  communication_templates: function (params) {
    return this.hasMany(CommunicationTemplates);;
  },

  initialize: function() {
    this.on('saving', this.hashPassword, this);
  },

  hashPassword: function(model, attrs, options) {
    var password = options.patch ? attrs.password : model.get('password');
    if (!password) { return; }
    return new Promise(function(resolve, reject) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, null, function(err, hash) {
          if (options.patch) {
            attrs.password = hash;
          }
          model.set('password', hash);
          resolve();
        });
      });
    });
  },

  comparePassword: function(password, done) {
    var model = this;
    bcrypt.compare(password, model.get('password'), function(err, isMatch) {
      done(err, isMatch);
    });
  },

  hidden: ['password', 'passwordResetToken', 'passwordResetExpires'],

  virtuals: {
    gravatar: function() {
      if (!this.get('email')) {
        return 'https://gravatar.com/avatar/?s=200&d=retro';
      }
      var md5 = crypto.createHash('md5').update(this.get('email')).digest('hex');
      return 'https://gravatar.com/avatar/' + md5 + '?s=200&d=retro';
    }
  }
});

module.exports = User;