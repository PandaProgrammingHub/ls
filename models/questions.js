var modelBase = require('../config/bookshelf');

var Subquestions = modelBase.extend({
  tableName: 'sub_questions',
  hasTimestamps: true
});

var Questions = modelBase.extend({
  tableName: 'questions',
  hasTimestamps: true,
  subQuestions: function () {
    return this.hasMany(Subquestions);
  }
});

module.exports = Questions;
