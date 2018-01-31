angular.module('MyApp')
.factory('divisionFactory', function($http) {
  return {
      getDivisionDetail: function() {
          return $http.get('/api/divisions');
      }
      
  };
});