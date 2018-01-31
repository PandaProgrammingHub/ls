var Myapp = angular.module('MyApp')
.controller('SchoolCreateController', function($scope,$rootScope, $location, $window, Account,$state,schoolMasterFactory,clusterFactory,pincodeFactory,academicYearFactory,schoolTypeFactory) {
  $scope.showCityState = true;  
  $scope.schoolCreate = function(schoolCreateForm) {
    var isFormValid = true;
    angular.forEach(schoolCreateForm.$error.required, function (field) {
      field.$setDirty();
      isFormValid = false;
    });
    if (schoolCreateForm.$valid && isFormValid) {
      schoolMasterFactory.addSchools($scope.school)
      .then(function (response) {
          $scope.messages = {
              success: [response.data]
          };
          $scope.addschoolData = response.data.school;
          $state.go('salesdashboard');        
          
      })
      .catch(function (response) {
          $scope.messages = {
              error: Array.isArray(response.data) ? response.data : [response.data]
          };
      });
    } else{
      return false;
    }
  };
  $scope.getClusterMaster = function() {
    clusterFactory.getClusterDetail()
        .then(function(response) {
            $scope.clusterMasters = response.data.cluster;
            $scope.messages = {
                success: [response.data]
            };
        })
        .catch(function(response) {
            $scope.messages = {
                error: Array.isArray(response.data) ? response.data : [response.data]
            };
        });
};
$scope.getAcademicYearMaster = function() {
    academicYearFactory.getAcademicYearDetail()
        .then(function(response) {
            $scope.academicYearMasters = response.data.academicYears;
            $scope.messages = {
                success: [response.data]
            };
        })
        .catch(function(response) {
            $scope.messages = {
                error: Array.isArray(response.data) ? response.data : [response.data]
            };
        });
};

$scope.getSchoolTypeMaster = function() {
    schoolTypeFactory.getSchoolTypeDetail()
        .then(function(response) {
            $scope.schoolTypeMasters = response.data.schoolTypes;
            $scope.messages = {
                success: [response.data]
            };
        })
        .catch(function(response) {
            $scope.messages = {
                error: Array.isArray(response.data) ? response.data : [response.data]
            };
        });
};
$scope.getClusterMaster();
$scope.getAcademicYearMaster();
$scope.getSchoolTypeMaster(); 
  $scope.showMessage = function(input) {
    var show = input.$invalid && (input.$dirty || input.$touched);
    return show;
  };
  $scope.checkPinCode = function(pincode){
      pincodeFactory.getPincodeDetails(pincode)
      .then(function(response) {
          $scope.pincodeDetails = response.data.pincode;
          $scope.messages = { success: [response.data] };
          $scope.uniqueStates = [];
          for(i = 0; i< $scope.pincodeDetails.length; i++){    
              if($scope.uniqueStates.indexOf($scope.pincodeDetails[i].state) === -1){
                  $scope.uniqueStates.push($scope.pincodeDetails[i].state);        
              }        
          }
          $scope.showCityState = false;
      })
      .catch(function(response) {
          $scope.messages = {
              error: Array.isArray(response.data) ? response.data : [response.data]
          };
      });
  }
});