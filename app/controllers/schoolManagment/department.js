angular.module('MyApp')
    .controller('departmentController', function ($scope, $state, departmentFactory) {

        $scope.getDepartmentDetails = function () {
            departmentFactory.getdepartmentDetail()
                .then(function (response) {
                    console.log(response.data.data);
                    $scope.departmentDetails = response.data.data;
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
        $scope.getDepartmentDetails();

        function body_paddingRemove() {
            $('body').addClass('remove_rightpadding');
        }

        $scope.getDepartmentDetailsByID = function (id) {
            $scope.departmentID = id;
            departmentFactory.getdepartmentDetailByID($scope.departmentID)
                .then(function (response) {
                    $scope.departmentDetailsByid = response.data.data;
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



        $scope.addDepartmentDetails = function (form) {
            $scope.errorMessage = '';
            if (form.$valid) {
                departmentFactory.add_departmentDetail($scope.addDepartmentData)
                    .then(function (response) {
                        console.log($scope.addDepartmentData);
                        if ((response.data.success) == true) {
                            $scope.messages = {
                                success: [response.data]
                            };
                            $scope.addDepartmentData = {};
                            form.$setUntouched();
                            form.$setPristine(true);
                            document.getElementById("addDepartmentModal").style.display = "none";
                            $('.modal-backdrop').removeClass('modal-backdrop');
                            $state.reload();
                            body_paddingRemove();
                        } else {
                            $scope.errorMessage = response.data.msg;
                            setTimeout(function() { $('.error_msg').addClass('hideError'); }, 2000);
                        }
                    })
                    .catch(function (response) {
                        $scope.messages = {
                            error: Array.isArray(response.data) ? response.data : [response.data]
                        };
                    });
            }
        };

        $scope.cancelDepartment = function () {
            $scope.addDepartmentData = {};
        };

        $scope.editDepartmentDetails = function (form) {
            if (form.$valid) {
                departmentFactory.editDepartmentDetail($scope.departmentDetailsByid, $scope.departmentID)
                    .then(function (response) {
                        if ((response.data.success) == true) {
                            $scope.messages = {
                                success: [response.data]
                            };
                            $scope.departmentDetailsByid = {};
                            form.$setUntouched();
                            form.$setPristine(true);
                            document.getElementById("editDepartmentModal").style.display = "none";
                            $('.modal-backdrop').removeClass('modal-backdrop');
                            $state.reload();
                            body_paddingRemove();
                        } else {
                            $scope.errorMessage = response.data.msg;
                            setTimeout(function() { $('.error_msg').addClass('hideError'); }, 2000);
                        }
                    })
                    .catch(function (response) {
                        $scope.messages = {
                            error: Array.isArray(response.data) ? response.data : [response.data]
                        };
                    });
            }
        };

        // pop-up alert
        // function pop_alert() {
        //     var x = document.getElementById("notification_popup");
        //     x.className = "show";
        //     setTimeout(function () {
        //         x.className = x.className.replace("show", "");
        //     }, 3000);
        // }
    });