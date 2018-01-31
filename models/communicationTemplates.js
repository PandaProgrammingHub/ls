var modelBase = require('../config/bookshelf');
var User = require('./user');

var CommunicationTemplate = modelBase.extend({
  tableName: 'communication_templates',
  hasTimestamps: true,

  createdBy: function (params) {
    return this.belongsTo(User, 'created_by', 'id');;
  }
});

module.exports = CommunicationTemplate;