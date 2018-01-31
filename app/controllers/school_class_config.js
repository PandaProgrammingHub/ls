angular.module('MyApp')
.filter('range', function() {
    return function(input, min, max) {
        min = parseInt(min); //Make string input int
        max = parseInt(max);
        for (var i=min; i<max; i++)
        input.push(i);
        return input;
    };
})
.controller('SchoolClassConfigController', function($scope, _ ,$rootScope, $location, $window, Account,$stateParams,$state,schoolMasterFactory) {
 // console.log("schoolId===="+$stateParams.schoolId);
 // console.log(lodash);
    $scope.getSchoolClassConfig = function() {
        schoolMasterFactory.getSchoolClassConfig($stateParams.schoolId)
        .then(function(response) {
            $scope.data = response.data;
        })
    }

    $scope.getSchoolClassConfig();

    $scope.fetchClassConfig = function(req) {
        // loop into the the class configs and get the single congfig with that id
        // return the key requested in second paramter

        // $scope.data.school_class_config.forEach(single_config => {
        //     // if( single_config.class_id == req.class_id){
        //     //     console.log(req);
        //     //     // console.log("returning true for classid -- "+req.class_id);
        //     //     $scope.class[req.index].checkbox = "true";
        //     // }else{
        //     //     $scope.class[].checkbox = "false";
        //     // }
        // });

    }
});