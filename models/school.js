var modelBase = require('../config/bookshelf');
var Documents = require('./documents');
var School_Type = require('./schoolTypes');
var Clusters = require('./clusters');
var Payments = require('./paymentDetails');
var School_Status = require('./schoolStatus');
var SchoolUser = require('./schoolUsers');
var uid = require('uid');

var School = modelBase.extend({
    tableName: 'schools',
    hasTimestamps: true,
    payments: function () {
        return this.hasMany(Payments);
    },
    Type: function () {
        return this.hasOne(School_Type, 'id', 'school_type_id');
    },
    Status: function () {
        return this.hasOne(School_Status, 'id', 'school_status_id');
    },
    Cluster: function () {
        return this.hasOne(Clusters, 'id', 'cluster_id');
    },
    documents: function () {
        return this.hasMany(Documents);
    },
    school_users: function () {
        return this.hasMany(SchoolUser);
    }
});
/*
School.on("creating", (model, attrs, options) => {
    
    //TODO: Test if this works and create uid in loop and check for uniqueness in table
    let school_uid = uid(12);
    attrs.uid = school_uid;

});
*/
module.exports = School;
