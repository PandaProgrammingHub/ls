angular.module('MyApp')
.factory('classFactory', function($http) {
  return {
      getClassDetail: function() {
          return $http.get('/api/classes');
      },
      getClassDetailByID: function(id) {
          console.log("id ",id);
          return $http.get('/api/classes/'+id);
      },
      addClassDetail: function(data) {
          return $http.post('/api/classes',data);
      },
      editClassDetail: function(data,id) {
          return $http.put('/api/classes/'+id,data);
      },
      deleteClassDetail: function(id) {
          return $http.delete('/api/classes/'+id);
      }
  };
});