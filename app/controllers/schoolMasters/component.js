angular.module('MyApp')
    .controller('componentController', function($scope, $state, componentFactory) {
        $scope.getComponentDetails = function() {
            componentFactory.getComponentDetail()
                .then(function(response) {
                    $scope.componentDetails = response.data.component;
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
        $scope.getComponentDetails();

        function body_paddingRemove() {
            $('body').addClass('remove_rightpadding');
        }

        $scope.getComponentDetailsByID = function(id) {
            $scope.componentID = id;
            componentFactory.getComponentDetailByID($scope.componentID)
                .then(function(response) {
                    $scope.componentDetailsByid = response.data.component;
                    $scope.componentDetailsByid.name = $scope.componentDetailsByid.component_name;
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

        $scope.addComponentDetails = function(form) {
          $scope.errorMessage = '';
            if(form.$valid){
                componentFactory.addComponentDetail($scope.addComponentData)
                    .then(function(response) {
                        if ((response.data.success) == true) {
                        $scope.messages = {
                            success: [response.data]
                        };
                        // $scope.getComponentDetails();
                        $scope.addComponentData = {};
                        form.$setUntouched();
                        form.$setPristine(true);
                        document.getElementById("addComponentModal").style.display = "none";
                        $('.modal-backdrop').removeClass('modal-backdrop');
                        $state.reload();
                        body_paddingRemove();
                        }else{
                        //   $scope.errorMessage = '';
                        //     return pop_alert();
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

        $scope.cancelComponent = function() {
          $scope.errorMessage = '';
            $scope.addComponentData = {};
        };

        $scope.editComponentDetails = function(form) {
            if(form.$valid) {
                componentFactory.editComponentDetail($scope.componentDetailsByid, $scope.componentID)
                    .then(function (response) {
                        if ((response.data.success) == true) {
                        $scope.messages = {
                            success: [response.data]
                        };
                        $scope.componentDetailsByid = {};
                        form.$setUntouched();
                        form.$setPristine(true);
                        document.getElementById("addComponentModal").style.display = "none";
                        $('.modal-backdrop').removeClass('modal-backdrop');
                        $state.reload();
                        body_paddingRemove();
                        }else{
                         //   return pop_alert();
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

        $scope.deleteComponentDetails = function(id) {
            $scope.id = id;
            componentFactory.deleteComponentDetail($scope.id)
                .then(function(response) {
                    $scope.messages = {
                        success: [response.data]
                    };
                    $scope.getComponentDetails();
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
