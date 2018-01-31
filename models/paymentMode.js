var modelBase = require('../config/bookshelf');

var PaymentMode = modelBase.extend({
  tableName: 'paymode',
  hasTimestamps: true
});

module.exports = PaymentMode;