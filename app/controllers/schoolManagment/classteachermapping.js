angular.module('MyApp').directive('onchange', ['$parse', function ($parse) {

        function fn_link(scope, element, attrs) {
            var onChange = $parse(attrs.onchange);
            element.on('change', function (event) {
                onChange(scope, {
                    $files: event.target.files
                });
            });
        };

        return {
            link: fn_link
        }
    }])
    .controller('ClassteacherMappingController', function ($scope, $http, $rootScope, Account, $stateParams, $state, classTeacherMappingFactory) {
        $scope.schoolId = $stateParams.schoolId;
        $scope.schoolname = $stateParams.schoolname;
        $scope.sortReverse = false;

        $scope.getClassTeacherMappingDetails = function () {
            classTeacherMappingFactory.getClassTeacherMappingDetail($scope.schoolId)
                .then(function (response) {
                    $scope.classTeacherMapDetails = response.data.classes;
                    console.log($scope.classTeacherMapDetails);
                    var len = ($scope.classTeacherMapDetails).length,
                        mid = len / 2;
                    $scope.left = $scope.classTeacherMapDetails.slice(0, mid);
                    $scope.right = $scope.classTeacherMapDetails.slice(mid, len);
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
        $scope.getClassTeacherMappingDetails();

        $scope.getClassteacherDetail = function () {
            classTeacherMappingFactory.getClassTeacherListDetail($scope.schoolId)
                .then(function (response) {
                    $scope.classTeacherList = response.data.users_details;
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

        $scope.submitTeacherName = function (teacherId, currentclassId) {
            console.log("currentclassId", currentclassId);
            console.log("teacherId", teacherId);
            var updatedId = {
                "class_teacher_id": teacherId
            }
            classTeacherMappingFactory.getClassTeacherSubmitDetail($scope.schoolId, currentclassId, updatedId)
                .then(function (response) {
                    console.log(response);
                    // return $scope.getClassteacherDetail();
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

        // for timetableupload

        $scope.uploadFile = function ($files, id) {
            console.log(id);
            var formdata = new FormData();
            angular.forEach($files, function (value, key) {
                formdata.append('timetable', value);
            });
            var request = {
                method: 'POST',
                url: '/api/classTimeTable/' + id,
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

    });