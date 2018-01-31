angular.module('MyApp')
    .controller('classDivisionController', function ($scope, $rootScope, Account, $stateParams, $state, classDivisionFactory) {
        $scope.schoolId = $stateParams.schoolId;
        $scope.schoolname = $stateParams.schoolname;

        $scope.getClassDivDetail = function () {
            classDivisionFactory.getClassDivisionDetail($scope.schoolId)
                .then(function (response) {
                    $scope.classDivisionDetail = response.data;
                    $scope.messages = {
                        success: [response.data]
                    };
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        }
        $scope.getClassDivDetail();

        
        $scope.getElgaRegularDivision = function () {
            angular.forEach($scope.classDivisionDetail, function (value, key) {
                if (value.type === "regular") {
                    $scope.regularDivisionDetails = value.divs;
                    console.log("regularDivisionDetails", $scope.regularDivisionDetails);
                }

                if (value.type === "elga") {
                    $scope.elgaDivisionDetails = value.divs;
                    console.log("elgaDivisionDetails", $scope.elgaDivisionDetails);
                }
            });

            // var div = angular.copy($scope.regularDivisionDetails);
            // $scope.filterDiv = {
            //     classDivisionFilterDetail: div
            // }
            // console.log("asli maal", $scope.filterDiv);
        }
       

        $scope.classDivisionFilter = function () {
            var params = {};
            if ($scope.classDivisionDetail.sfirstname) {
                params.sfirstname = $scope.classDivisionDetail.sfirstname;
            }

            if ($scope.selectClassDivision) {
                params.class_id = $scope.selectClassDivision.id;
            }

            if ($scope.selectedDivision) {
                params.division_id = $scope.selectedDivision.id;
            }

            classDivisionFactory.classDivisionFilterDetail($scope.schoolId, params)
                .then(function (response) {
                    console.log(response);
                    $scope.classDivisionFilterDetails = response.data.students;
                    $scope.getElgaRegularDivision();
                    $scope.messages = {
                        success: [response.data]
                    };
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        }

        $scope.getDivision = function (class_id) {
            var id = class_id;
            angular.forEach($scope.classDivisionDetail, function (value, key) {
                if (value.id == id) {
                    $scope.divisionList = value.divs;
                    console.log($scope.divisionList);
                }
            });
        }

        $scope.submitRegularDivDetail = function (div_id, divisionData) {
            // console.log("div_id", div_id);
            // console.log("divisionData", divisionData);
            var admissionID = divisionData.admissionId;
            var divisionDetail = {
                "division_id": div_id,
            }
            classDivisionFactory.classDivDetailsSubmit(divisionDetail, admissionID)
                .then(function (response) {
                    console.log(response);
                    // return $scope.classDivisionFilter();
                    $scope.messages = {
                        success: [response.data]
                    };
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        }

        $scope.submitElgaDivDetail = function (div_id, divisionData) {
            var admissionID = divisionData.admissionId;
            var divisionDetail = {
                "elga_division_id": div_id
            }
            classDivisionFactory.classDivDetailsSubmit(divisionDetail, admissionID)
                .then(function (response) {
                    console.log(response);
                    // return $scope.classDivisionFilter();
                    $scope.messages = {
                        success: [response.data]
                    };
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        }
    });