var modelBase = require('../config/bookshelf');

var Sections = modelBase.extend({
  tableName: 'sections',
  hasTimestamps: true
});

module.exports = Sections;
