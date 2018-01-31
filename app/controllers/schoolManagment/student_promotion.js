angular.module('MyApp').controller('Studentpromotioncontroller', function ($scope, $rootScope, Account, $stateParams, $state, studentpromotionfactory, classDivisionFactory) {
    $scope.schoolId = $stateParams.schoolId;
    $scope.schoolname = $stateParams.schoolname;
    console.log($scope.schoolname);
    console.log($scope.schoolId);
    $scope.GetstudentsData = function () {
        if (angular.isUndefined($scope.studentfilterdata) || $scope.studentfilterdata == null || $scope.studentfilterdata == "") {
            alert("No any input for search");
        } else {
            if ((angular.isUndefined($scope.studentfilterdata.regularclassid) || $scope.studentfilterdata.regularclassid == null || $scope.studentfilterdata.regularclassid == "")
                && (angular.isUndefined($scope.studentfilterdata.elgastartclassid) || $scope.studentfilterdata.elgastartclassid == null || $scope.studentfilterdata.elgastartclassid == "") &&
                (angular.isUndefined($scope.studentfilterdata.name) || $scope.studentfilterdata.name == null || $scope.studentfilterdata.name == "")) {
                alert("Selection only on division is not allowed");
            } else {
                $scope.regularaction = [{
                    id: "promote",
                    name: "Promote"
                }, {
                    id: "terminate",
                    name: "Detaine"
                }, {
                    id: "tc",
                    name: "TC"
                }];
                studentpromotionfactory.getStudentsdetail($scope.schoolId, $scope.studentfilterdata)
                    .then(function (response) {
                        $scope.studentspromotionDetails = response.data.students;
                        console.log($scope.studentspromotionDetails);
                        angular.forEach($scope.studentspromotionDetails, function (student, key) {
                            student.rdivisioDisabled = false;
                            student.eclassDisabled = false;
                            student.edivisionDisabled = false;
                        });

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
        }

    };
    $scope.getClassDetails = function () {
        classDivisionFactory.getClassDivisionDetail($scope.schoolId)
            .then(function (response) {
                // console.log(response);
                $scope.classDetails = response.data;
                $scope.regularclass = [];
                $scope.elgaclass = [];
                $scope.sectionDetails_regular = [];
                $scope.sectionDetails_elga = [];
                if ($scope.classDetails.length != 0) {
                    for (i = 0; i < $scope.classDetails.length; i++) {
                        if ($scope.classDetails[i].type == "regular") {
                            $scope.regularclass.push($scope.classDetails[i]);
                            if ($scope.classDetails[i].divs.length != 0) {
                                for (j = 0; j < $scope.classDetails[i].divs.length; j++) {
                                    if ($scope.checkValue($scope.classDetails[i].divs[j].id, $scope.sectionDetails_regular) == true) {
                                        $scope.sectionDetails_regular.push($scope.classDetails[i].divs[j]);
                                    }
                                }
                            }
                        } else {
                            $scope.elgaclass.push($scope.classDetails[i]);
                            if ($scope.classDetails[i].divs.length != 0) {
                                for (j = 0; j < $scope.classDetails[i].divs.length; j++) {
                                    if ($scope.checkValue($scope.classDetails[i].divs[j].id, $scope.sectionDetails_elga) == true) {
                                        $scope.sectionDetails_elga.push($scope.classDetails[i].divs[j]);
                                    }
                                }
                            }
                        }

                    }
                    // console.log($scope.regularclass);
                    // console.log($scope.elgaclass);
                    // console.log($scope.sectionDetails);
                }
                $scope.messages = {
                    success: [response.data]
                };
            })
            .catch(function (response) {
                $scope.messages = {
                    error: Array.isArray(response.data) ? response.data : [response.data]
                };
            });
    };
    $scope.getClassDetails();
    $scope.checkValue = function (value, arr) {
        var status = true;
        if (arr.length != 0) {
            for (var i = 0; i < arr.length; i++) {
                var name = arr[i].id;
                if (name == value) {
                    status = false;
                    break;
                }
            }
        }
        return status;
    }
    $scope.onregularactionChange = function (action, studentsDetail) {
        if (action == "tc") {
            studentsDetail.rdivisioDisabled = true;
            studentsDetail.eclassDisabled = true;
            studentsDetail.edivisionDisabled = true;
        }else{
            studentsDetail.rdivisioDisabled = false;
            studentsDetail.eclassDisabled = false;
            studentsDetail.edivisionDisabled = false;
        }
        studentsDetail.action = action;
    };
    $scope.submitpromotiondata = function (studentspromotionDetails) {
        $scope.promotedstudentlist = [];
        var i = 0;
        // console.log(studentspromotionDetails);
        if (angular.isUndefined(studentspromotionDetails) || studentspromotionDetails == null) {

        } else {
            if (studentspromotionDetails.length != 0) {
                for (j = 0; j < studentspromotionDetails.length; j++) {
                    if (studentspromotionDetails[j].hasOwnProperty('action') && studentspromotionDetails[j].hasOwnProperty('new_regular_division_id') &&
                        studentspromotionDetails[j].hasOwnProperty('elga_action') && studentspromotionDetails[j].hasOwnProperty('new_elga_division_id') &&
                        !angular.isUndefined(studentspromotionDetails[j].admissionId)) {
                        $scope.promotedstudentlist[i] = {
                            "student_admission_id": studentspromotionDetails[j].admissionId,
                            "action": studentspromotionDetails[j].action,
                            "new_regular_division_id": studentspromotionDetails[j].new_regular_division_id,
                            "elga_action": studentspromotionDetails[j].elga_action,
                            "new_elga_division_id": studentspromotionDetails[j].new_elga_division_id
                        }
                        i = i + 1;
                    }
                }
                console.log($scope.promotedstudentlist);
                studentpromotionfactory.promotesstudent($scope.promotedstudentlist)
                    .then(function (response) {
                        console.log(response);
                        if (response.statusText == "OK") {
                            $scope.GetstudentsData();
                            alert("Student has been promoted successfully");
                        } else {
                            alert("Something went wrong during student promotion");
                        }
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
        }
    };
});




