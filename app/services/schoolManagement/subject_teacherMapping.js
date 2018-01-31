angular.module('MyApp')
  .factory('subjectTeacherMappingFactory', function ($http) {
    return {

      getSubjectTeacherMappingDetail: function (schoolId) {
        return $http.get('/api/schoolSubjectConfig?school_id=' + schoolId + '');
      },

      getSubjectTeacherFilterDetail: function (schoolId, query_params) {
        var url = '/api/schoolSubjectConfig?school_id=' + schoolId;
        return $http({
          url: url,
          method: 'GET',
          params: query_params
        });
      },

      getClassTeacherListDetail: function (schoolId) {
        return $http.get('/api/schools/' + schoolId + '/users/');
      },

      getClassDivisionListDetail: function (schoolId) {
        return $http.get('/api/schools/' + schoolId + '/classesanddivisions');
      },

      getSubjectListDetail: function () {
        return $http.get('/api/subjects');
      },

      getSubjectTeacherSubmitDetail: function (subTeacherId, updatedId) {
        return $http.put('api/schoolSubjectConfig/' + subTeacherId + '', updatedId);
      }
    };
  });