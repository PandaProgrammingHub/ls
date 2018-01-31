angular.module('MyApp')
  .factory('roleFactory', function($http) {
    return {
        getRoleDetail: function() {
            return $http.get('/api/roles');
        },
        getRoleDetailByID: function(id) {
            console.log("id ",id);
            return $http.get('/api/roles/'+id);
        },
        addRoleDetail: function(data) {
            return $http.post('/api/roles',data);
        },
        editRoleDetail: function(data,id) {
            return $http.put('/api/roles/'+id,data);
        }
    };
  });