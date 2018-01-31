angular.module('MyApp')
.controller('SchoolMasterController', function($scope,$rootScope, $location, $window, Account,$stateParams,$state,schoolMasterFactory) {
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
    $scope.schoolSerachForm = function(schoolSerachForm){
        console.log(schoolSerachForm.school);
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
    $scope.manageSchoolStudents = function($index,schoolname){
        $state.go('manage_students',{schoolId:$index,schoolname:schoolname});
    }
    $scope.studentPromotion = function($index,schoolname){
        $state.go('student_promotion',{schoolId:$index,schoolname:schoolname});
    }
    
    $scope.schoolSerach = function(form) {
        if(form.$valid){
        console.log($scope.school);        
        }
    };

    $scope.cancelSchoolSearch = function() {
        $scope.school = {};
    };

    $scope.manageSchoolClassTeacher = function($index, schoolname){
        $state.go('class_teacherMapping',{schoolId:$index, schoolname:schoolname});
    }

    $scope.manageSchoolSubjectTeacher = function($index,schoolname){
        $state.go('subject_teacherMapping',{schoolId:$index,schoolname:schoolname});
    }

    $scope.editBasicProfileSchoolManagement = function($index,schoolname){
        $state.go('editBasicProfileSchool',{schoolId:$index,schoolname:schoolname});
    }

    $scope.editBoyScore = function($index,schoolname){
        $state.go('editBoyScore',{schoolId:$index,schoolname:schoolname});
    }

    $scope.classDivision = function($index,schoolname){
        $state.go('classDivision',{schoolId:$index,schoolname:schoolname});
    }
});
