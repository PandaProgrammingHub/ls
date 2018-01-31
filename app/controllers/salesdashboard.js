angular.module('MyApp')
.controller('DashboardController', function($scope,$rootScope, $location, $window, Account,$stateParams,$state,schoolMasterFactory) {
    $scope.getSchoolSalesList = function () {
        schoolMasterFactory.getSchoolSalesList()
            .then(function (response) {
                $scope.schoolLists = response.data.schools;
                $scope.messages = {
                    success: [response.data]
                };
                console.log($scope.schoolLists);
            })
            .catch(function (response) {
                $scope.messages = {
                    error: Array.isArray(response.data) ? response.data : [response.data]
                };
            });
    };
    $scope.getSchoolSalesList();
    $scope.schoolSerach = function(form){
        if(form.$valid){
            var sreachString = qs($scope.school).trim();
            //console.log(sreachString);
            $scope.errorMessage = '';
            schoolMasterFactory.searchSchoolSalesList(sreachString)
            .then(function (response) {
                if ((response.data.success) == true) {
                    $scope.messages = {
                        success: [response.data]
                    };
                  $scope.schoolLists = response.data.schools;
                angular.element('#schoolSearchModal').modal('hide');
                  $scope.school = {};
                }else{
                    $scope.errorMessage = response.data.msg;                    
                }
                
            })
            .catch(function (response) {
                $scope.messages = {
                    error: Array.isArray(response.data) ? response.data : [response.data]
                };
            });
            
        }
    }
    $scope.editBasicProfile = function($index,schoolname){
         $state.go('school_basic_profile',{schoolId:$index,schoolname : schoolname});
    }
    $scope.editClassConfiguration = function($index,schoolname){
        $state.go('school_class_config',{schoolId:$index,schoolname: schoolname});    
    }
    $scope.editContentConfiguration = function($index,schoolname){
        $state.go('school_content_config',{schoolId:$index,schoolname:schoolname});     
    }
    $scope.editActiveSchool = function(id){  
        schoolMasterFactory.activeSchool(id)
        .then(function (response) {
            $scope.messages = {
                success: [response.data]
            };
            $state.reload();
        })
        .catch(function (response) {
            $scope.messages = {
                error: Array.isArray(response.data) ? response.data : [response.data]
            };
        });     
    }
    $scope.editDeactiveSchool = function(id){  
        schoolMasterFactory.deactiveSchool(id)
        .then(function (response) {
            $scope.messages = {
                success: [response.data]
            };
            $state.reload();
        })
        .catch(function (response) {
            $scope.messages = {
                error: Array.isArray(response.data) ? response.data : [response.data]
            };
        });     
    }
    $scope.editDocument = function($index,schoolname){
        $state.go('school_documents',{schoolId:$index,schoolname:schoolname});
        
    }
    $scope.editPaymentList = function($index,schoolname){
        $state.go('school_paymentlist',{schoolId:$index,schoolname:schoolname});
    }
    $scope.manageSchoolUsers = function($index,schoolname){
        $state.go('school_users',{schoolId:$index,schoolname:schoolname});
    }

    $scope.openSchoolSearch = function() {
        $scope.errorMessage = '';        
    };
    $scope.cancelSchoolSearch = function() {
        $scope.school = {};
    };
    function body_paddingRemove() {
        $('body').addClass('remove_rightpadding');
    }

    function qs(obj, prefix){
        var str = [];
        for (var p in obj) {
          var k = prefix ? prefix + "[" + p + "]" : p, 
              v = obj[k];
          str.push(angular.isObject(v) ? qs(v, k) : (k) + "=" + encodeURIComponent(v));
        }
        return str.join("&");
      }
      $scope.showMessage = function(input) {
        var show = input.$invalid && (input.$dirty || input.$touched);
        return show;
      };
});
