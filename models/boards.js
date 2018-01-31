var modelBase = require('../config/bookshelf');

var Boards = modelBase.extend({
  tableName: 'board',
  hasTimestamps: true
});

module.exports = Boards;
