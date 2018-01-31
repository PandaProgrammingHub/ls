angular.module('MyApp')
  .factory('componentFactory', function($http) {
    return {
        getComponentDetail: function() {
            return $http.get('/api/components');
        },
        getComponentDetailByID: function(id) {
            console.log("id ",id);
            return $http.get('/api/components/'+id);
        },
        addComponentDetail: function(data) {
            return $http.post('/api/components',data);
        },
        editComponentDetail: function(data,id) {
            return $http.put('/api/components/'+id,data);
        },
        deleteComponentDetail: function(id) {
            return $http.delete('/api/components/'+id);
        }
    };
  });