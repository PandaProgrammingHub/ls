var modelBase = require('../config/bookshelf');

var PaymentType = modelBase.extend({
  tableName: 'payment_type',
  hasTimestamps: true
});

module.exports = PaymentType;