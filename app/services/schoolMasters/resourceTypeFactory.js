angular.module('MyApp')
  .factory('resourceTypeFactory', function($http) {
    return {
        getResourceTypeDetail: function() {
            return $http.get('/api/resource_type');
        },
        getResourceTypeDetailByID: function(id) {
            console.log("id ",id);
            return $http.get('/api/resource_type/'+id);
        },
        addResourceTypeDetail: function(data) {
            return $http.post('/api/resource_type',data);
        },
        editResourceTypeDetail: function(data,id) {
            return $http.put('/api/resource_type/'+id,data);
        },
        deleteResourceTypeDetail: function(id) {
            return $http.delete('/api/resource_type/'+id);
        }
    };
  });