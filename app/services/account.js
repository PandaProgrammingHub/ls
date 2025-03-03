angular.module('MyApp')
  .factory('Account', function($http) {
    return {
      updateProfile: function(data) {
        return $http.put('/account', data);
      },
      changePassword: function(data) {
        return $http.put('/account', data);
      },
      deleteAccount: function() {
        return $http.delete('/account');
      },
      forgotPassword: function(data) {
        return $http.post('/forgotPassword', data);
      },
      resetPassword: function(data) {
        return $http.post('/resetPassword', data);
      },
      verifyOtp: function (data) {
        return $http.post('/verifyOtp', data);
      },
      verifyForgotPassword: function(data){
        return $http.post('/resetPassword', data);
      }
    };
  });