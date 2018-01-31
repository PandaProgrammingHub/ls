angular.module('MyApp')
    .controller('schoolrolesController', function($scope, $state, roleFactory) {
        
        $scope.getRoleDetails = function() {
            roleFactory.getRoleDetail()
                .then(function(response) {
                    $scope.roleDetails = response.data.roles;
                    $scope.messages = {
                        success: [response.data]
                    };
                })
                .catch(function(response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        };
        $scope.getRoleDetails();

        function body_paddingRemove() {
            $('body').addClass('remove_rightpadding');
        }

        $scope.getRoleDetailsByID = function(id) {
            $scope.roleID = id;
            roleFactory.getRoleDetailByID($scope.roleID)
                .then(function(response) {
                    $scope.roleDetailsByid = response.data.role;
                    $scope.messages = {
                        success: [response.data]
                    };
                })
                .catch(function(response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        };

        $scope.addRoleDetails = function(form) {
            $scope.errorMessage = '';
            if(form.$valid){
                var formData = {
                    role_name: $scope.role_name,
                    role_type: "School Managment User"
                }            
                roleFactory.addRoleDetail(formData)
                    .then(function(response) {
                        if ((response.data.success) == true) {
                        $scope.messages = {
                            success: [response.data]
                        };
                        // $scope.getRoleDetails();
                        $scope.addRoleData = {};
                        form.$setUntouched();
                        form.$setPristine(true);
                        $('.modal-backdrop').removeClass('modal-backdrop');
                        $state.reload();
                        body_paddingRemove();
                        }else{
                            $scope.errorMessage = response.data.msg;
                            setTimeout(function() { $('.error_msg').addClass('hideError'); }, 2000);
                        }
                    })
                    .catch(function(response) {
                        $scope.messages = {
                            error: Array.isArray(response.data) ? response.data : [response.data]
                        };
                });
            }
        };

        $scope.cancelRole = function() {
            $scope.addRoleData = {};
        };

        $scope.editRoleDetails = function(form) {
            $scope.errorMessage = '';
            if(form.$valid) {
                roleFactory.editRoleDetail($scope.roleDetailsByid, $scope.roleID)
                    .then(function (response) {
                        if ((response.data.success) == true) {
                        $scope.messages = {
                            success: [response.data]
                        };
                        $scope.roleDetailsByid = {};
                        form.$setUntouched();
                        form.$setPristine(true);
                        document.getElementById("editRoleModal").style.display = "none";
                        $('.modal-backdrop').removeClass('modal-backdrop');
                        $state.reload();
                        body_paddingRemove();
                        }else{
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

    });
