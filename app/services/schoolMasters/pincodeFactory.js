angular.module('MyApp')
.factory('pincodeFactory', function($http) {
  return {
      getPincodeDetails: function(pincode) {
          return $http.get('/api/pincodes?code='+pincode);
      },
  };
});