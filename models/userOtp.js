var modelBase = require('../config/bookshelf');

var userOtp = modelBase.extend({
  tableName: 'user_otp',
  hasTimestamps: true
});

module.exports = userOtp;
