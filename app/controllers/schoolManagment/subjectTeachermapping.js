angular.module('MyApp')
    .controller('SubjectteacherMappingController', function ($scope, $rootScope, Account, $stateParams, $state, subjectTeacherMappingFactory) {
        $scope.schoolId = $stateParams.schoolId;
        $scope.schoolname = $stateParams.schoolname;

        $scope.classDivisionListDetails = function () {
            subjectTeacherMappingFactory.getClassDivisionListDetail($scope.schoolId)
                .then(function (response) {
                    $scope.classDivisionList = response.data;
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        }
        $scope.classDivisionListDetails();

        $scope.selectedClassDivision = function (class_id) {
            var id = class_id;
            angular.forEach($scope.classDivisionList, function (value, key) {
                if (value.id == id) {
                    $scope.divisionList = value.divs;
                    console.log($scope.divisionList);
                }
            });
        }

        $scope.getSubjectListDetails = function () {
            subjectTeacherMappingFactory.getSubjectListDetail()
                .then(function (response) {
                    $scope.subjectList = response.data.subjects;
                })
                .catch(function (response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        }
        $scope.getSubjectListDetails();

        $scope.getClassteacherDetail = function () {
            subjectTeacherMappingFactory.getClassTeacherListDetail($scope.schoolId)
                .then(function (response) {
                    $scope.classTeacherList = response.data.users_details;
                    console.log($scope.classTeacherList);
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
        $scope.getClassteacherDetail();


        $scope.subjectFilter = function () {

            var params = {};
            if ($scope.selectClassDivision || $scope.subjectTeacherMapDetail.subject_teacher || $scope.selectsubjectList) {

                if ($scope.selectClassDivision) {
                    params.class_id = $scope.selectClassDivision.id;
                }

                if ($scope.subjectdivisionList) {
                    params.division_id = $scope.subjectdivisionList.id;
                }

                if ($scope.selectsubjectList) {
                    params.subject_id = $scope.selectsubjectList.id;
                }

                if ($scope.selectClassSubjectTeacherlist) {
                    params.subject_teacher_id = $scope.selectClassSubjectTeacherlist.id;
                }
            } else {
                alert("please division...");
            }

            subjectTeacherMappingFactory.getSubjectTeacherFilterDetail($scope.schoolId, params)
                .then(function (response) {
                    console.log(response);
                    $scope.subjectTeacherMapDetails = response.data.school_content;
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

        $scope.submitSubjectTeacherName = function (subjectId, currentRowId) {
            // alert(subjectId);
            var updatedData = {
                "subject_teacher_id": subjectId
            };
            subjectTeacherMappingFactory.getSubjectTeacherSubmitDetail(currentRowId, updatedData)
                .then(function (response) {
                    console.log(response);
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