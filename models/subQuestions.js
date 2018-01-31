var modelBase = require('../config/bookshelf');

var question = modelBase.extend({
  tableName: 'questions',
  hasTimestamps: true
});

var lerningIndicator = modelBase.extend({
  tableName: 'learning_indicators',
  hasTimestamps: true
});

var subQuestions = modelBase.extend({
  tableName: 'sub_questions',
  hasTimestamps: true,
  questions: function () {
    return this.hasOne(question);
  },
  learningIndicators: function () {
    return this.hasOne(lerningIndicator);
  }
});

module.exports = subQuestions;
