angular.module('MyApp')
  .controller('LoginCtrl', function($scope, $rootScope, $location, $window,$state, $auth) {
    $scope.login = function(loginForm) {
      var isFormValid = true;
      angular.forEach(loginForm.$error.required, function (field) {
        field.$setDirty();
        isFormValid = false;
      });
      if (loginForm.$valid && isFormValid) {
        $auth.login($scope.user)
          .then(function(response) {
            if(response.data.success) {
              $rootScope.currentUser = response.data.user;
              $window.localStorage.user = JSON.stringify(response.data.user);
              // $location.path('/salesdashboard');
              //$state.go('salesdashboard');  
              $window.location.reload();            
            }
          })
          .catch(function(response) {
            if(response.data.success == false){
              $scope.errorMessage = response.data.msg;
            } else {
              $scope.errorMessage = response.data[0].msg;
            }
          });
      }
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          // $location.path('/salesdashboard');
          $state.go('salesdashboard');          
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };

    $scope.showMessage = function(input) {
      var show = input.$invalid && (input.$dirty || input.$touched);
      // console.log('in input i s=', input, 'is true=', show);
      return show;
    };
  });