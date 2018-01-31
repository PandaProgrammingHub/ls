angular.module('MyApp')
  .controller('ForgotCtrl', function($scope, Account,$location,$state) {
    $scope.forgotPassword = function(forgotPasswordForm) {
      var isFormValid = true;
      angular.forEach(forgotPasswordForm.$error.required, function (field) {
        field.$setDirty();
        isFormValid = false;
      }); 
      if (forgotPasswordForm.$valid && isFormValid) { 
      Account.forgotPassword($scope.user)
        .then(function(response) {
          if(response.data.success) {
            $state.go('verifyforgotpassword',{mobile:$scope.user.mobile});
          }
          $scope.messages = {
            success: [response.data]
          };
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
    $scope.showMessage = function(input) {
      var show = input.$invalid && (input.$dirty || input.$touched);
      // console.log('in input i s=', input, 'is true=', show);
      return show;
    };
  });
