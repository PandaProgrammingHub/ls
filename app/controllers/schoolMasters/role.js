angular.module('MyApp')
    .controller('roleController', function($scope, $state, roleFactory, permissionFactory) {

        $scope.permissions_ids = [];

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

        $scope.getRoleDetailsByID = function(id) {
            $scope.roleID = id;
            roleFactory.getRoleDetailByID($scope.roleID)
                .then(function(response) {
                    $scope.roleDetailsByid = response.data.role;
                    $scope.roleDetailsByid.name = $scope.roleDetailsByid.role_name;
                    $scope.roleDetailsByid.type = $scope.roleDetailsByid.role_type;
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

        $scope.getUserPermissions = function() {
            permissionFactory.getUserPermission()
                .then(function(response) {
                    $scope.permissions = response.data.permissions;
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
                if($scope.permissions_ids.length > 0){
                    $scope.addRoleData.permissions_ids = $scope.permissions_ids;
                }
                roleFactory.addRoleDetail($scope.addRoleData)
                    .then(function(response) {
                        if ((response.data.success) == true) {
                            $scope.messages = {
                                success: [response.data]
                            };
                            // $scope.getRoleDetails();
                            $scope.addRoleData = {};
                            form.$setUntouched();
                            form.$setPristine(true);
                            document.getElementById("addRoleModal").style.display = "none";
                            $('.modal-backdrop').removeClass('modal-backdrop');
                            $state.reload();
                            body_paddingRemove();
                        }else{
                          $scope.errorMessage = response.data.msg;
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
          $scope.errorMessage = '';
            $scope.addRoleData = {};
        };

        $scope.editRoleDetails = function(form) {
            if(form.$valid) {
                if($scope.permissions_ids.length > 0){
                    $scope.roleDetailsByid.permissions_ids = $scope.permissions_ids;
                }
                roleFactory.editRoleDetail($scope.roleDetailsByid, $scope.roleID)
                    .then(function (response) {
                        if ((response.data.success) == true) {
                            $scope.messages = {
                                success: [response.data]
                            };
                            $scope.roleDetailsByid = {};
                            form.$setUntouched();
                            form.$setPristine(true);
                            document.getElementById("addRoleModal").style.display = "none";
                            $('.modal-backdrop').removeClass('modal-backdrop');
                            $state.reload();
                            body_paddingRemove();
                        }else{
                          //  return pop_alert();
                          $scope.errorMessage = response.data.msg;
                          
                        }   
                    })
                    .catch(function (response) {
                        $scope.messages = {
                            error: Array.isArray(response.data) ? response.data : [response.data]
                        };
                    });
            }
        };

        $scope.deleteRoleDetails = function(id) {
            $scope.id = id;
            roleFactory.deleteRoleDetail($scope.id)
                .then(function(response) {
                    $scope.messages = {
                        success: [response.data]
                    };
                    $scope.getRoleDetails();
                })
                .catch(function(response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        };

        $scope.getRoleDetails();
        $scope.getUserPermissions();
        
        function body_paddingRemove() {
            $('body').addClass('remove_rightpadding');
        }
        
        // pop-up alert
        function pop_alert() {
            var x = document.getElementById("notification_popup");
            x.className = "show";
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }

    });
