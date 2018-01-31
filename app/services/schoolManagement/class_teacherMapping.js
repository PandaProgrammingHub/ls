angular.module('MyApp')
  .factory('classTeacherMappingFactory', function ($http) {
    return {
      getClassTeacherMappingDetail: function (schoolId) {
        return $http.get('/api/schools/' + schoolId + '/schoolclasses');
      },
      getClassTeacherListDetail: function (schoolId) {
        return $http.get('/api/schools/' + schoolId + '/users/');
      },
      getClassTeacherSubmitDetail: function (schoolId, classId, data) {
        return $http.put('/api/schools/' + schoolId + '/schoolclasses/' + classId + '', data);
      }
    };
  });