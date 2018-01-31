var modelBase = require('../config/bookshelf');

var Subquestions = modelBase.extend({
  tableName: 'sub_questions',
  hasTimestamps: true
});

var learningOutcome = modelBase.extend({
  tableName: 'learning_outcomes',
  hasTimestamps: true
});

var Learning_Indicators = modelBase.extend({
  tableName: 'learning_indicators',
  hasTimestamps: true,
  subQuestions: function () {
    return this.hasMany(Subquestions);
  },
  learningOutcomes: function () {
    return this.hasOne(learningOutcome);
  }
});

module.exports = Learning_Indicators;
