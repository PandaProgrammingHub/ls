angular.module('MyApp')
.controller('LogoutCtrl', function($scope, $rootScope, $location, $window,$state, $auth) {
    $scope.init = function(){
      $window.localStorage.clear();
      $state.go('login');
    }
    $scope.init();

});