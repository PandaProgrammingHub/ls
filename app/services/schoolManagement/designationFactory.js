angular.module('MyApp')
  .factory('designationFactory', function($http) {
    return {
        getDesignationDetail: function() {
            return $http.get('/api/designations');
        },
        getDesignationDetailByID: function(id) {
            console.log("id ",id);
            return $http.get('/api/designations/'+id);
        },
        addDesignationDetail: function(data) {
            return $http.post('/api/designations',data);
        },
        editDesignationDetail: function(data,id) {
            return $http.put('/api/designations/'+id,data);
        },
        deleteDesignationDetail: function(id) {
            return $http.delete('/api/designations/'+id);
        }
    };
  });