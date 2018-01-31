var MyApp = angular.module('MyApp')
  .controller('SignupCtrl', function($scope, $rootScope, $location, $window, $auth,$state) {
    $scope.signup = function(signupForm) {
      var isFormValid = true;
      angular.forEach(signupForm.$error.required, function (field) {
        field.$setDirty();
        isFormValid = false;
      });
      if (signupForm.$valid && isFormValid) {
        $auth.signup($scope.user)
          .then(function(response) {
            if(response.data.success) {
              $state.go('verifyotp',{mobile:$scope.user.mobile});
            }
            //$auth.setToken(response);
            //$rootScope.currentUser = response.data.user;
            //$window.localStorage.user = JSON.stringify(response.data.user);

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
          $location.path('/');
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
      return show;
    };
  });