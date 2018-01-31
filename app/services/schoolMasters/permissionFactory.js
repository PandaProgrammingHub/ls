angular.module('MyApp')
  .factory('permissionFactory', function($http) {
    return {
        getUserPermission: function() {
            return $http.get('/api/permissions');
        }
    };
  });