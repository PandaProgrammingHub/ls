var modelBase = require('../config/bookshelf');
var Payment_Status = require('./paymentStatus');
var Payment_Type = require('./paymentType');
var Paymode = require('./paymentMode');

var Payment_details = modelBase.extend({
  tableName: 'payement_details',
  hasTimestamps: true,
  school_id: function () {
    return this.belongsTo('School', 'id');
  },
  Type: function () {
    return this.hasOne(Payment_Type, 'payment_type_id', 'id');
  },
  Status: function () {
    return this.hasOne(Payment_Status, 'status_id', 'id');
  },
  Paymode: function () {
    return this.hasOne(Paymode, 'pay_mode_id', 'id');
  }
});

module.exports = Payment_details;
