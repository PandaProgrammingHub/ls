angular.module('MyApp')
  .factory('departmentFactory', function($http) {
    return {
        getdepartmentDetail: function() {
            return $http.get('/api/departments');
        },
        getdepartmentDetailByID: function(id) {
            return $http.get('/api/departments/'+id);
        },
        add_departmentDetail : function(data) {
            return $http.post('/api/departments',data);
        },
        editDepartmentDetail: function(data,id) {
            return $http.put('/api/departments/'+id,data);
        }
    };
  });