angular.module('MyApp')
  .factory('classDivisionFactory', function ($http) {
    return {

      classDivisionFilterDetail: function (schoolId, query_params) {
        var url = 'api/studentDivision?school_id=' + schoolId + '';
        return $http({
          url: url,
          method: 'GET',
          params: query_params
        });
      },

      getClassDivisionDetail: function (schoolId) {
        return $http.get('/api/schools/' + schoolId + '/classesanddivisions');
      },

      classDivDetailsSubmit: function(data, admissionID){
        return $http.put('/api/studentDivision/'+admissionID+'', data);
      }

      //   getClassTeacherSubmitDetail: function (schoolId,classId,data) {
      //     console.log(classId);
      //     return $http.put('/api/schools/' + schoolId + '/schoolclasses/' + classId + '',data);
      //   }
    };
  });