angular.module('MyApp')
    .controller('resourceTypeController', function($scope, $state, resourceTypeFactory) {
        $scope.getResourceTypeDetails = function() {
            resourceTypeFactory.getResourceTypeDetail()
                .then(function(response) {
                    $scope.resourceTypeDetails = response.data.resourceType;
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
        $scope.getResourceTypeDetails();

        function body_paddingRemove() {
            $('body').addClass('remove_rightpadding');
        }

        $scope.getResourceTypeDetailsByID = function(id) {
            $scope.resourceTypeID = id;
            resourceTypeFactory.getResourceTypeDetailByID($scope.resourceTypeID)
                .then(function(response) {
                    $scope.resourceTypeDetailsByid = response.data.resourceType;
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

        $scope.addResourceTypeDetails = function(form) {
          $scope.errorMessage = '';
            if(form.$valid){
                resourceTypeFactory.addResourceTypeDetail($scope.addResourceTypeData)
                    .then(function(response) {
                        if ((response.data.success) == true) {
                            $scope.messages = {
                                success: [response.data]
                            };
                            // $scope.getResourceTypeDetails();
                            $scope.addResourceTypeData = {};
                            form.$setUntouched();
                            form.$setPristine(true);
                            document.getElementById("addResourceTypeModal").style.display = "none";
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

        $scope.cancelResourceType = function() {
          $scope.errorMessage = '';
            $scope.addResourceTypeData = {};
        };

        $scope.editResourceTypeDetails = function(form) {
            if(form.$valid) {
                resourceTypeFactory.editResourceTypeDetail($scope.resourceTypeDetailsByid, $scope.resourceTypeID)
                    .then(function (response) {
                        if ((response.data.success) == true) {
                            $scope.messages = {
                                success: [response.data]
                            };
                            $scope.resourceTypeDetailsByid = {};
                            form.$setUntouched();
                            form.$setPristine(true);
                            document.getElementById("addResourceTypeModal").style.display = "none";
                            $('.modal-backdrop').removeClass('modal-backdrop');
                            $state.reload();
                            body_paddingRemove();
                            }else{
                          //      pop_alert();
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

        $scope.deleteResourceTypeDetails = function(id) {
            $scope.id = id;
            resourceTypeFactory.deleteResourceTypeDetail($scope.id)
                .then(function(response) {
                    $scope.messages = {
                        success: [response.data]
                    };
                    $scope.getResourceTypeDetails();
                })
                .catch(function(response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        };

        // pop-up alert
        function pop_alert() {
            var x = document.getElementById("notification_popup");
            x.className = "show";
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    });
