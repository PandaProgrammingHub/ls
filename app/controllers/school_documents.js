angular.module('MyApp')
.controller('SchoolDocumentsController', function($scope,$rootScope, $location, $window, Account,$stateParams,$state,schoolDocumentFactory) {
//   console.log("schoolId===="+$stateParams.schoolId);
  $scope.schoolId = $stateParams.schoolId;
  $scope.schoolname = $stateParams.schoolname;
  // calling onInit


  $scope.getDocumentsBySchoolID = function () {
    schoolDocumentFactory.getDocumentsBySchoolID($scope.schoolId)
        .then(function (response) {
            $scope.document_details = response.data.document_details;
            $scope.messages = {
                success: [response.data]
            };
            console.log($scope.document_details);
        })
        .catch(function (response) {
            $scope.messages = {
                error: Array.isArray(response.data) ? response.data : [response.data]
            };
        });
};
//$scope.getDocumentsBySchoolID();

$scope.addDocument = function (form) {
    if (form.$valid) {
        schoolDocumentFactory.addDocument($scope.schoolId,$scope.school)
            .then(function (response) {
                $scope.messages = response.data.success;
                if($scope.messages == true){
                    $window.alert("Document upload successfully.");
                }else{
                    $window.alert("opps!! something went wrong.");                    
                }
                $scope.addDocumentData = response.data.documents_details;
                $state.reload();
                $state.go('school_master');
                
            
            })
            .catch(function (response) {
                $scope.messages = {
                    error: Array.isArray(response.data) ? response.data : [response.data]
                };
            });
    }

};


});
