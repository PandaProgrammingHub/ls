angular.module('MyApp')
.factory('academicYearFactory', function($http) {
  return {
      getAcademicYearDetail: function() {
          return $http.get('/api/academicYears');
      },
      getAcademicYearDetailByID: function(id) {
          return $http.get('/api/academicYears/'+id);
      },
      addAcademicYearDetail: function(data) {
          return $http.post('/api/academicYears',data);
      },
      editAcademicYearDetail: function(data,id) {
          return $http.put('/api/academicYears/'+id,data);
      },
      deleteAcademicYearDetail: function(id) {
          return $http.delete('/api/academicYears/'+id);
      }
  };
});