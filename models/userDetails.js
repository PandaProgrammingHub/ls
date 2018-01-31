var modelBase = require('../config/bookshelf');

var userDetails = modelBase.extend({
  tableName: 'user_details',
  hasTimestamps: true
});

module.exports = userDetails;
