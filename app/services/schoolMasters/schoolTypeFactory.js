angular.module('MyApp')
.factory('schoolTypeFactory', function($http) {
  return {
      getSchoolTypeDetail: function() {
          return $http.get('/api/schoolTypes');
      },
      getSchoolTypeDetailByID: function(id) {
          console.log("id ",id);
          return $http.get('/api/schoolTypes/'+id);
      },
      addSchoolTypeDetail: function(data) {
          return $http.post('/api/schoolTypes',data);
      },
      editSchoolTypeDetail: function(data,id) {
          return $http.put('/api/schoolTypes/'+id,data);
      },
      deleteSchoolTypeDetail: function(id) {
          return $http.delete('/api/schoolTypes/'+id);
      }
  };
});