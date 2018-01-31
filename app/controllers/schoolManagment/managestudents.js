angular.module('MyApp').directive('onchange', ['$parse', function ($parse) {

    function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.onchange);
        element.on('change', function (event) {
            onChange(scope, { $files: event.target.files });
        });
    };

    return {
        link: fn_link
    }
}]).controller('ManagestudentsController', function ($scope, $http, $rootScope, Account, $stateParams, $state, managestudentsfactory, classDivisionFactory) {
    $scope.schoolId = $stateParams.schoolId;
    $scope.schoolname = $stateParams.schoolname;
    $scope.itemsPerPage = 10;
    $scope.currentPage = 1;
    $scope.studentsDetails;
    $scope.studentfilterdata;
    $scope.files;
    $scope.showData = function () {
        managestudentsfactory.getmanageStudentsdetail($scope.schoolId, $scope.currentPage, $scope.studentfilterdata)
            .then(function (response) {
                $scope.studentsDetails = response.data.students;
                // console.log(response);
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
    $scope.showData();

    $scope.showData_filter = function () {
        $scope.currentPage = 1;
        $scope.showData();
    };

    $scope.range = function () {

        var ps = [];
        if ($scope.pageCount() != 0) {
            var rangeSize = $scope.pageCount();
            var start;
            start = $scope.currentPage;
            if (start > $scope.pageCount() - rangeSize) {
                start = $scope.pageCount() - rangeSize + 1;
            }

            for (var i = start; i < start + rangeSize; i++) {
                if (i >= 1)
                    ps.push(i);
            }
            return ps;
        } else {
            return ps;
        }
    };

    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            $scope.showData();
        }
    };

    $scope.DisablePrevPage = function () {
        return $scope.currentPage === 1 ? "disabled" : "";
    };

    $scope.pageCount = function () {
        if ($scope.studentsDetails == null || $scope.studentsDetails == "") {
            return 0;
        } else {
            if ($scope.studentsDetails.length != 0) {
                return Math.ceil($scope.studentsDetails[0].fullcount / $scope.itemsPerPage);
            } else {
                return 0;
            }
        }
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pageCount()) {
            $scope.currentPage++;
            $scope.showData();
        }
    };

    $scope.DisableNextPage = function () {
        if ($scope.pageCount() != 0) {
            return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
        } else {
            return "disabled";
        }

    };

    $scope.setPage = function (n) {
        $scope.currentPage = n;
        $scope.showData();
    };

    // for filter field data


    // $scope.getClassDetails = function () {
    //     classFactory.getClassDetail()
    //         .then(function (response) {
    //             $scope.classDetails = response.data.classes;
    //             $scope.regularclass = [];
    //             $scope.elgaclass = [];
    //             // console.log($scope.classDetails);
    //             for (i = 0; i < $scope.classDetails.length; i++) {
    //                 if ($scope.classDetails[i].class_type == "regular") {
    //                     $scope.regularclass.push($scope.classDetails[i]);
    //                 } else {
    //                     $scope.elgaclass.push($scope.classDetails[i]);
    //                 }
    //             }
    //             $scope.messages = {
    //                 success: [response.data]
    //             };
    //         })
    //         .catch(function (response) {
    //             $scope.messages = {
    //                 error: Array.isArray(response.data) ? response.data : [response.data]
    //             };
    //         });
    // };
    // $scope.getClassDetails();

    // $scope.getSectionDetails = function () {
    //     divisionFactory.getDivisionDetail()
    //         .then(function (response) {
    //             $scope.sectionDetails = response.data.divisions;
    //             // console.log($scope.sectionDetails);
    //             $scope.messages = {
    //                 success: [response.data]
    //             };
    //         })
    //         .catch(function (response) {
    //             $scope.messages = {
    //                 error: Array.isArray(response.data) ? response.data : [response.data]
    //             };
    //         });
    // };
    // $scope.getSectionDetails();


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


    // for editing

    $scope.editStudentmanagement = function (schoolId, student_id, schoolname) {
        var url = $state.href('edit_student_management', { schoolId: schoolId, student_id: student_id, schoolname: schoolname });
        window.open(url, '_blank');
        // $state.go('edit_student_management', { schoolId: schoolId, student_id: student_id, schoolname: schoolname });
    }

    // for adding

    $scope.addStudentmanagement = function (schoolId, schoolname) {
        $state.go('add_student_management', { schoolId: schoolId, schoolname: schoolname });
    }


    // for student list file upload


    $scope.uploadFile = function ($files) {
        var formdata = new FormData();
        angular.forEach($files, function (value, key) {
            formdata.append('studentimport', value);
        });
        var request = {
            method: 'POST',
            url: '/api/schools/' + $scope.schoolId + '/students/import',
            data: formdata,
            headers: {
                'Content-Type': undefined
            }
        };
        $http(request)
            .success(function (d) {
                alert("File uploaded Successfull");
            })
            .error(function () {
                alert("Something went wrong");
            });
    };

    // for student list file download

    $scope.downloadFile = function () {
        managestudentsfactory.downloadFile($scope.schoolId, $scope.studentfilterdata)
            .then(function (response) {
                console.log(response);

                var blob = new Blob([response.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                });
                var blobURL = (window.URL || window.webkitURL).createObjectURL(blob);
                var anchor = document.createElement("a");
                anchor.download = "StudentList.xlsx";
                anchor.href = blobURL;
                anchor.click();
                if (response.statusText == "OK") {
                    alert("File downloaded Successfull");
                } else {
                    alert("Something went wrong");
                }
                // var objectUrl = URL.createObjectURL(blob);
                // window.open(objectUrl);
            },
            function (error) {
                debugger;
            });
    };


});

angular.module('MyApp').filter('pagination', function () {
    return function (input, start) {
        start = parseInt(start, 10);
        return input.slice(start);
    };
});



