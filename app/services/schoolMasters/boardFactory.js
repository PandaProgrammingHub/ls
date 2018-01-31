angular.module('MyApp')
  .factory('boardFactory', function($http) {
    return {
        getBoardDetail: function() {
            return $http.get('/api/boards');
        },
        getBoardDetailByID: function(id) {
            console.log("id ",id);
            return $http.get('/api/boards/'+id);
        },
        addBoardDetail: function(data) {
            return $http.post('/api/boards',data);
        },
        editBoardDetail: function(data,id) {
            return $http.put('/api/boards/'+id,data);
        },
        deleteBoardDetail: function(id) {
            return $http.delete('/api/boards/'+id);
        }
    };
  });