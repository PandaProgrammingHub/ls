var modelBase = require('../config/bookshelf');
var RolesModel = require('./roles')


var School_Users = modelBase.extend({
  tableName: 'school_users',
  hasTimestamps: true,
  school_id: function () {
    return this.belongsTo('School', 'id');
  },
  user_id: function () {
    return this.belongsTo('User', 'id');
  },
  role_id: function () {
    return this.hasOne(RolesModel, 'id');
  },
});

module.exports = School_Users;
