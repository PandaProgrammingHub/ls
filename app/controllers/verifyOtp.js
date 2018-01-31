angular.module('MyApp')
  .controller('VerifyOTPController', function($scope,$rootScope, $location, $window, Account,$stateParams) {
    //console.log($stateParams);
    $scope.user={
      mobile:$stateParams.mobile
    };
    $scope.verifyOtp = function(verifyOtpForm) {
      var isFormValid = true;
      angular.forEach(verifyOtpForm.$error.required, function (field) {
        field.$setDirty();
        isFormValid = false;
      }); 
      if (verifyOtpForm.$valid && isFormValid) { 
      Account.verifyOtp($scope.user)
        .then(function(response) {
          if(response.data.success == true){
            $rootScope.currentUser = response.data.user;
            $window.localStorage.user = JSON.stringify(response.data.user);
            $window.localStorage.satellizer_token = response.data.token;
            $location.path('/salesdashboard');
          }
          // $scope.messages = {
          //   success: [response.data]
          // };
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
