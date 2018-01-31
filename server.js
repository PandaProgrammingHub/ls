var express                 = require('express');
var path                    = require('path');
var compression             = require('compression');
var cookieParser            = require('cookie-parser');
var bodyParser              = require('body-parser');
var expressValidator        = require('express-validator');
var dotenv                  = require('dotenv');
var jwt                     = require('jsonwebtoken');
var moment                  = require('moment');
var request                 = require('request');
var app                     = express();
var router                  = require('./routers/router');
//var fileUpload              = require('express-fileupload');
var logger                  = require('./config/logger');

// Load environment variables from .env file
dotenv.load();

app.set('port', process.env.PORT || 3000);
app.use(compression());
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(logger.requestLogger);
//app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/files', express.static(path.join(__dirname, 'files')));

var authUtil = require('./utils/authUtils');

app.use('/', router);
app.use('/api/boards', require('./routers/boardsRoutes'));
app.use('/api/clusters', require('./routers/clustersRoutes'));
app.use('/api/components', require('./routers/componentsRoutes'));
app.use('/api/sections', require('./routers/sectionsRoutes'));
app.use('/api/communicationTemplates', require('./routers/communicationTemplateRoutes'));
app.use('/api/roles', require('./routers/rolesRoutes'));
app.use('/api/resource_type', require('./routers/resourceTypeRoutes'));
app.use('/api/classes', require('./routers/classes'));
app.use('/api/divisions', require('./routers/divisionsRoutes'));
app.use('/api/subjects', require('./routers/subjectsRoutes'));
app.use('/api/schools', require('./routers/schoolRoutes'));
app.use('/api/permissions', require('./routers/permissionsRoutes'));
app.use('/api/pincodes', require('./routers/pincodeRoutes'));
app.use('/api/payments', require('./routers/schoolPaymentsRoutes'));
// app.use('/api/schoolClassConfig', require('./routers/schoolClassRoutes'));
app.use('/api/schoolSubjectConfig', require('./routers/schoolSubjectRoutes'));
app.use('/api/departments', require('./routers/departmentsRoutes'));
app.use('/api/designations', require('./routers/designationsRoutes'));
app.use('/api/academicYears', require('./routers/academicYearsRoutes'));
app.use('/api/schoolTypes', require('./routers/schoolTypesRoutes'));
app.use('/api/boyElgaAssessment', require('./routers/boyElgaAssessmentRoutes'));
app.use('/api/teacherApp/v1', require('./routers/teacherAppRoutes/v1'));
app.use('/api/studentPromotions', require('./routers/studentPromotionsRoutes'));
app.use('/api/studentDivision', require('./routers/studentDivisionRoutes'));
app.use('/api/classTimeTable', require('./routers/classTimeTableRoutes'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
