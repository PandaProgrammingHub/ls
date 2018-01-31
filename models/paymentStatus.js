var modelBase = require('../config/bookshelf');

var PaymentStatus = modelBase.extend({
  tableName: 'status',
  hasTimestamps: true
});

module.exports = PaymentStatus;