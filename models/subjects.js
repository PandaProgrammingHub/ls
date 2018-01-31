var modelBase = require('../config/bookshelf');

var Subjects = modelBase.extend({
  tableName: 'subjects',
  hasTimestamps: true
});

module.exports = Subjects;
