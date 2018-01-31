var bunyanMongoDbLogger     = require('bunyan-mongodb-logger');
var bunyanRequest           = require('bunyan-request');

var logger = bunyanMongoDbLogger({
  name: 'ReqResLogger',
  streams: ['mongodb'],
  url: 'mongodb://172.104.39.37:27017/logging'
  // level: process.env.LOG_LEVEL || config.logger.level
});

var requestLogger = bunyanRequest({
  logger: logger,
  headerName: 'x-request-id'
});

exports.requestLogger = requestLogger;
