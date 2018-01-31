angular.module('MyApp')
    .controller('EditBoyScoreController', function ($scope, $rootScope, Account, $stateParams, $state, boyScoreFactory) {
        $scope.schoolId = $stateParams.schoolId;
        $scope.schoolname = $stateParams.schoolname;

        $scope.getLiteacylevelDetails = function () {
            boyScoreFactory.getLiteacylevelDetail()
                .then(function (response) {
                    $scope.liteacyLevelDetail = response.data.classes;
                    $scope.litercyLevel = new Array();
                    angular.forEach($scope.liteacyLevelDetail, function (value, key) {
                        if (value.class_type == "elga") {
                            $scope.litercyLevel.push(value);
                        }
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
        $scope.getLiteacylevelDetails();

        $scope.getClassDivDetail = function () {
            boyScoreFactory.getClassDivDetails($scope.schoolId)
                .then(function (response) {
                    $scope.classDivDetail = response.data;
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

        $scope.getDivision = function (class_id) {
            var id = class_id;
            angular.forEach($scope.classDivDetail, function (value, key) {
                if (value.id == id) {
                    $scope.divisionList = value.divs;
                    console.log($scope.divisionList);
                }
            });
        }

        $scope.boyFilterDetailResponse = function () {
            var params = {};

            if ($scope.selectedClassDiv) {
                params.class_id = $scope.selectedClassDiv.id;
            }

            if ($scope.selectDivision) {
                params.division_id = $scope.selectDivision.id;
            }

            if ($scope.boyStudentDetail) {
                params.elga_assigned = $scope.boyStudentDetail.elgastatus;
            }

            if ($scope.boyStudentDetail) {
                params.student_name = $scope.boyStudentDetail.studentName;
            }

            boyScoreFactory.getBoyScoreFilterDetail($scope.schoolId, params)
                .then(function (response) {
                    var data = response.data.students;
                    $scope.studentsVM = angular.copy(data);
                    angular.forEach($scope.studentsVM, function (student, key) {
                        if (student.T1 == null) {
                            student.T1 = {};
                            student.T1.scoreDisabled = false;
                        } else {
                            student.T1.scoreDisabled = true;
                        }

                        if (student.T2 == null) {
                            student.T2 = {};
                            student.T2.show = false;
                        } else {
                            if (student.T2.score) {
                                student.T2.show = true;
                                student.T2.scoreDisabled = true;
                            } else {
                                student.T2.show = true;
                                student.T2.scoreDisabled = false;
                            }
                        }

                        if (student.T3 == null) {
                            student.T3 = {};
                            student.T3.show = false;
                        } else {
                            student.T3.scoreDisabled = true;
                            student.T3.show = true;
                        }

                        if (student.T4 == null) {
                            student.T4 = {};
                            student.T4.show = false;
                        } else {
                            student.T4.scoreDisabled = true;
                            student.T4.show = true;
                        }
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

        $scope.boyScoreSubmitT1 = function (student) {
            var currentTest = "T1";
            console.log(student);
            $scope.$watch(student.T1, function (newNames, oldNames) {
                alert(student.T1);
                console.log(newNames);
                console.log(oldNames);
    
            });

            if (student[currentTest].score == null && student[currentTest].level == null) {
                alert("Please select test level and score.");
            } else {
                student[currentTest].scoreDisabled = true;
                student[currentTest].levelDisabled = true;
                student[currentTest].show = true;
                var nextTest = "T2";
                var valueT1detail = {
                    "test_number": "1",
                    "test_level_id": student[currentTest].id,
                    "test_score": student[currentTest].score
                }
                boyScoreFactory.getBoyDetailSubmit(valueT1detail, student.admissionId)
                    .then(function (response) {
                        if (response.data.status == 0) {
                            student.assignedElga = {};
                            student.assignedElga.name = response.data.assignedElga.name;
                            student[nextTest].scoreDisabled = true;
                            // student[nextTest].show = true;
                            student[nextTest].show = false;
                        } else {
                            student[nextTest].level = response.data.nextTest.literacy_level_start;
                            student[nextTest].scoreDisabled = false;
                            student[nextTest].show = true;
                            $scope.literacy_levelT2id = response.data.nextTest.id;
                        }
                    }, function (error) {
                        student[currentTest].scoreDisabled = false;
                        student[currentTest].levelDisabled = false;
                    })
                    .catch(function (response) {
                        $scope.messages = {
                            error: Array.isArray(response.data) ? response.data : [response.data]
                        };
                    });
            }
        }

        $scope.boyScoreSubmitT2 = function (student) {
            var currentTest = "T2";
            if (student[currentTest].score == null && student[currentTest].level == null) {
                alert("Please select test level and score.");
            } else {
                student[currentTest].scoreDisabled = true;
                student[currentTest].levelDisabled = true;
                student[currentTest].show = true;
                var nextTest = "T3";
                var valueT1detail = {
                    "test_number": "2",
                    "test_level_id": $scope.literacy_levelT2id,
                    "test_score": student[currentTest].score
                }
                boyScoreFactory.getBoyDetailSubmit(valueT1detail, student.admissionId)
                    .then(function (response) {
                        // console.log(response);
                        if (response.data.status == 0) {
                            student.assignedElga = {};
                            student.assignedElga.name = response.data.assignedElga.name;
                            student[nextTest].scoreDisabled = true;
                            // student[nextTest].show = true;
                            student[nextTest].show = false;
                        } else {
                            student[nextTest].level = response.data.nextTest.literacy_level_start;
                            student[nextTest].scoreDisabled = false;
                            student[nextTest].show = true;
                            $scope.literacy_levelT3id = response.data.nextTest.id;
                        }
                        $scope.messages = {
                            success: [response.data]
                        };
                    }, function (error) {
                        student[currentTest].scoreDisabled = false;
                        student[currentTest].levelDisabled = false;
                    })
                    .catch(function (response) {
                        $scope.messages = {
                            error: Array.isArray(response.data) ? response.data : [response.data]
                        };
                    });
            }
        }

        $scope.boyScoreSubmitT3 = function (student) {
            var currentTest = "T3";
            // console.log(student[currentTest]);
            if (student[currentTest].score == null && student[currentTest].level == null) {
                alert("Please select test level and score.");
            } else {
                student[currentTest].scoreDisabled = true;
                student[currentTest].levelDisabled = true;
                student[currentTest].show = true;
                var nextTest = "T4";
                var valueT1detail = {
                    "test_number": "3",
                    "test_level_id": $scope.literacy_levelT3id,
                    "test_score": student[currentTest].score
                }
                boyScoreFactory.getBoyDetailSubmit(valueT1detail, student.admissionId)
                    .then(function (response) {
                        // console.log(response);
                        if (response.data.status == 0) {
                            student.assignedElga = {};
                            student.assignedElga.name = response.data.assignedElga.name;
                            student[nextTest].scoreDisabled = true;
                            // student[nextTest].show = true;
                            student[nextTest].show = false;
                        } else {
                            student[nextTest].level = response.data.nextTest.literacy_level_start;
                            student[nextTest].scoreDisabled = false;
                            student[nextTest].show = true;
                            $scope.literacy_levelT4id = response.data.nextTest.id;
                        }
                        $scope.messages = {
                            success: [response.data]
                        };
                    }, function (error) {
                        student[currentTest].scoreDisabled = false;
                        student[currentTest].levelDisabled = false;
                    })
                    .catch(function (response) {
                        $scope.messages = {
                            error: Array.isArray(response.data) ? response.data : [response.data]
                        };
                    });
            }
        }

        $scope.boyScoreSubmitT4 = function (student) {
            var currentTest = "T4";
            if (student[currentTest].score == null && student[currentTest].level == null) {
                alert("Please select test level and score.");
                return false;
            } else {
                student[currentTest].scoreDisabled = true;
                student[currentTest].levelDisabled = true;
                student[currentTest].show = true;
                // var nextTest = "T2";
                var valueT1detail = {
                    "test_number": "4",
                    "test_level_id": $scope.literacy_levelT4id,
                    "test_score": student[currentTest].score
                }
                boyScoreFactory.getBoyDetailSubmit(valueT1detail, student.admissionId)
                    .then(function (response) {
                        // console.log(response);
                        if (response.data.status == 0) {
                            student.assignedElga = {};
                            student.assignedElga.name = response.data.assignedElga.name;
                            student[nextTest].scoreDisabled = true;
                            // student[nextTest].show = true;
                            student[nextTest].show = false;
                        }
                        // else {
                        //     student[nextTest].level = response.data.id;
                        //     student[nextTest].scoreDisabled = false;
                        //     student[nextTest].show = true;
                        // }
                        $scope.messages = {
                            success: [response.data]
                        };
                    }, function (error) {
                        student[currentTest].scoreDisabled = false;
                        student[currentTest].levelDisabled = false;
                    })
                    .catch(function (response) {
                        $scope.messages = {
                            error: Array.isArray(response.data) ? response.data : [response.data]
                        };
                    });
            }
        }

        $scope.deletStudenBOYDetail = function (student) {
            boyScoreFactory.deletStudenBOYDetails(student.admissionId)
                .then(function (response) {
                    if (response.data.success == true) {

                        student.T1 = {
                            levelDisabled: false,
                            scoreDisabled: false
                        };
                        student.T2 = {
                            levelDisabled: false,
                            scoreDisabled: false
                        };
                        student.T3 = {
                            levelDisabled: false,
                            scoreDisabled: false
                        };
                        student.T4 = {
                            levelDisabled: false,
                            scoreDisabled: false
                        };

                        student.assignedElga = {};

                    }
                });
        }


    });