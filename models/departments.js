var modelBase = require('../config/bookshelf');
var User = require('./user');

var Department = modelBase.extend({
  tableName: 'departments',
  hasTimestamps: true,
  
  manager: function(){
    return this.belongsTo(User, 'manager_id', 'id');
  }
});

module.exports = Department;
