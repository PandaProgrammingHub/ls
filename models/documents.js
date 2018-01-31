var modelBase = require('../config/bookshelf');

var Documents = modelBase.extend({
  tableName: 'documents',
  hasTimestamps: true,
  school_id: function () {
    return this.belongsTo('School', 'id');
  }
});

module.exports = Documents;
