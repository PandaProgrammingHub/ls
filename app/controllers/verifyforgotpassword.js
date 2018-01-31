var MyApp = angular.module('MyApp')
.controller('VerifyForgotPasswordController', function($scope,$rootScope, $location, $window, Account,$stateParams) {
  //console.log($stateParams);
  $scope.user={
    mobile:$stateParams.mobile
  };
  $scope.verifyforgotpassword = function(verifyforgotpasswordForm) {
    var isFormValid = true;
    angular.forEach(verifyforgotpasswordForm.$error.required, function (field) {
      field.$setDirty();
      isFormValid = false;
    }); 
    if (verifyforgotpasswordForm.$valid && isFormValid) { 
    Account.verifyForgotPassword($scope.user)
      .then(function(response) {
        if(response.data.success == true){
            $scope.successMessages = "your password reset successfully!!";
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
MyApp.directive("compareTo", function () {  
    return {  
        require: "ngModel",  
        scope:  
        {  
            confirmPassword: "=compareTo"  
        },  
        link: function (scope, element, attributes, modelVal)  
        {  
            modelVal.$validators.compareTo = function (val)  
            {  
                return val == scope.confirmPassword;  
            };  
            scope.$watch("confirmPassword", function ()  
            {  
                modelVal.$validate();  
            });  
        }  
    };  
});  
