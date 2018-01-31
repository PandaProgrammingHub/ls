angular.module('MyApp')
.factory('editBasicProfileFactory', function ($http) {
  return {
    getEditBasicProfileDetail: function (schoolId) {
      return $http.get('/api/schools/'+ schoolId + '');
    },

    getEditBasicProfileSubmit: function (schoolId, data) {
      return $http.put('/api/schools/'+ schoolId + '/profile', data);
    }
  };
});
