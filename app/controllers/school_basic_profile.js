var Myapp = angular.module('MyApp')
.controller('SchoolBasicProfileController', function($scope,$rootScope, $location, $window, Account,$stateParams,$state,schoolMasterFactory,clusterFactory,pincodeFactory,academicYearFactory,schoolTypeFactory) {
  //console.log("schoolId===="+$stateParams.schoolId);
  $scope.schoolId = $stateParams.schoolId;
  $scope.schoolname = $stateParams.schoolname;
  $scope.showCityState = true;
  $scope.school = {};  
  $scope.schoolBasicProfile = function(schoolBasicProfileForm) {
    var isFormValid = true;
    angular.forEach(schoolBasicProfileForm.$error.required, function (field) {
      field.$setDirty();
      isFormValid = false;
    });
    if (schoolBasicProfileForm.$valid && isFormValid) {
      schoolMasterFactory.editSchoolBasicInfo($scope.schoolId,$scope.school)
      .then(function (response) {
          $scope.messages = {
              success: [response.data]
          };
          $scope.addschoolData = response.data.school;
          $state.go('school_master');     
      })
      .catch(function (response) {
          $scope.messages = {
              error: Array.isArray(response.data) ? response.data : [response.data]
          };
      });
      console.log($scope.school);
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
$scope.getSchoolBasicInfo = function() {
    schoolMasterFactory.getSchoolBasicInfo($scope.schoolId)
        .then(function(response) {

            //$scope.school = response.data.school;
           
            $scope.school.acadyear      =  response.data.school.acadminc_year_id.toString();        
            $scope.school.address1      =  response.data.school.address_line1;        
            $scope.school.address2      =  response.data.school.address_line2;        
            $scope.school.logo          =  response.data.school.logo;        
            $scope.school.coverImage    =  response.data.school.cover_img;        
            $scope.school.admin_mobile  =  Number(response.data.school.admin_telephone);
            $scope.school.cluster       =  response.data.school.cluster_id.toString();        
            $scope.school.email         =  response.data.school.email;        
            $scope.school.established   =  new Date(response.data.school.estabished);        
            $scope.school.home_phone    =  Number(response.data.school.telephone2);
            $scope.school.pincode       =  Number(response.data.school.pincode_id);
            if($scope.school.pincode) $scope.checkPinCode($scope.school.pincode);          
             $scope.school.city         =  response.data.school.city;        
             $scope.school.state        =  response.data.school.state;        
             $scope.school.mission      =  response.data.school.mission;     
             $scope.school.name         =  response.data.school.name;        
             $scope.school.newspaper    =  response.data.school.news_paper; 
             $scope.school.school_chain =  response.data.school.school_chain;      
             $scope.school.school_type  =  response.data.school.school_type_id.toString();     
             $scope.school.vision       =  response.data.school.vision;     
             $scope.school.website      =  response.data.school.website;        
             $scope.school.yearBook     =  Number(response.data.school.year_book); 



            $scope.messages = {
                success: [response.data]
            };
          // console.log($scope.school);
        })
        .catch(function(response) {
            $scope.messages = {
                error: Array.isArray(response.data) ? response.data : [response.data]
            };
        });
};
$scope.getSchoolBasicInfo();
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
/*
   A directive to enable two way binding of file field
*/
Myapp.directive('demoFileModel', function ($parse) {
    return {
        restrict: 'A', //the directive can be used as an attribute only

        /*
         link is a function that defines functionality of directive
         scope: scope associated with the element
         element: element on which this directive used
         attrs: key value pair of element attributes
         */
        link: function (scope, element, attrs) {
            var model = $parse(attrs.demoFileModel),
                modelSetter = model.assign; //define a setter for demoFileModel

            //Bind change event on the element
            element.bind('change', function () {
                //Call apply on scope, it checks for value changes and reflect them on UI
                scope.$apply(function () {
                    //set the model value
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
});