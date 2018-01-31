angular.module('MyApp')
.controller('EditBasicProfileSchoolController', function($scope,$rootScope,Account,$stateParams,$state,editBasicProfileFactory) {
$scope.schoolId = $stateParams.schoolId;
$scope.schoolname = $stateParams.schoolname;
console.log($scope.schoolname);

$scope.getEditBasicProfileDetails = function() {
    editBasicProfileFactory.getEditBasicProfileDetail($scope.schoolId)
    .then(function(response) {
        $scope.schoolBasicInfoMapDetails = response.data.school;
        // console.log($scope.schoolBasicInfoMapDetails);
        $scope.messages = {
            success: [response.data]
        };
    })
    .catch(function(response) {
        $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
        };
    });
}
$scope.getEditBasicProfileDetails();


$scope.editBasicProfilePost = function() {
    editBasicProfileFactory.getEditBasicProfileSubmit($scope.schoolId, $scope.schoolBasicInfoMapDetails)
    .then(function(response) {
        $scope.messages = {
            success: [response.data]
        };
    })
    .catch(function(response) {
        $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
        };
    });
}

});
