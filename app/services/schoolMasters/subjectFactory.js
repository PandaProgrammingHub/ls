angular.module('MyApp')
  .factory('subjectFactory', function($http) {
    return {
        getSubjectDetail: function() {
            return $http.get('/api/subjects');
        },
        getSubjectDetailByID: function(id) {
            console.log("id ",id);
            return $http.get('/api/subjects/'+id);
        },
        addSubjectDetail: function(data) {
            return $http.post('/api/subjects',data);
        },
        editSubjectDetail: function(data,id) {
            return $http.put('/api/subjects/'+id,data);
        },
        deleteSubjectDetail: function(id) {
            return $http.delete('/api/subjects/'+id);
        }
    };
  });