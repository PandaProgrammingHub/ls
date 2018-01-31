angular.module('MyApp')
  .factory('clusterFactory', function($http) {
    return {
        getClusterDetail: function() {
            return $http.get('/api/clusters');
        },
        getClusterDetailByID: function(id) {
            console.log("id ",id);
            return $http.get('/api/clusters/'+id);
        },
        addClusterDetail: function(data) {
            return $http.post('/api/clusters',data);
        },
        editClusterDetail: function(data,id) {
            return $http.put('/api/clusters/'+id,data);
        },
        deleteClusterDetail: function(id) {
            return $http.delete('/api/clusters/'+id);
        }
    };
  });