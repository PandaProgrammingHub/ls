angular.module('MyApp')
  .factory('sectionFactory', function($http) {
    return {
        getSectionDetail: function() {
            return $http.get('/api/sections');
        },
        getSectionDetailByID: function(id) {
            console.log("id ",id);
            return $http.get('/api/sections/'+id);
        },
        addSectionDetail: function(data) {
            return $http.post('/api/sections',data);
        },
        editSectionDetail: function(data,id) {
            return $http.put('/api/sections/'+id,data);
        },
        deleteSectionDetail: function(id) {
            return $http.delete('/api/sections/'+id);
        }
    };
  });