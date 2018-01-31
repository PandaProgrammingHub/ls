angular.module('MyApp')
    .controller('clusterController', function($scope, $state, clusterFactory) {
        $scope.getClusterDetails = function() {
            clusterFactory.getClusterDetail()
                .then(function(response) {
                    $scope.clusterDetails = response.data.cluster;
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
        $scope.getClusterDetails();

        function body_paddingRemove() {
            $('body').addClass('remove_rightpadding');
        }

        $scope.getClusterDetailsByID = function(id) {
            $scope.clusterID = id;
            clusterFactory.getClusterDetailByID($scope.clusterID)
                .then(function(response) {
                    $scope.clusterDetailsByid = response.data.cluster;
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

        $scope.addClusterDetails = function(form) {
          $scope.errorMessage = '';
            if(form.$valid){
                clusterFactory.addClusterDetail($scope.addClusterData)
                    .then(function(response) {
                        if ((response.data.success) == true) {
                        $scope.messages = {
                            success: [response.data]
                        };
                        // $scope.getClusterDetails();
                        $scope.addClusterData = {};
                        form.$setUntouched();
                        form.$setPristine(true);
                        document.getElementById("addClusterModal").style.display = "none";
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

        $scope.cancelCluster = function() {
          $scope.errorMessage = '';
            $scope.addClusterData = {};
        };

        $scope.editClusterDetails = function(form) {
            if(form.$valid) {
                clusterFactory.editClusterDetail($scope.clusterDetailsByid, $scope.clusterID)
                    .then(function (response) {
                        if ((response.data.success) == true) {
                        $scope.messages = {
                            success: [response.data]
                        };
                        $scope.clusterDetailsByid = {};
                        form.$setUntouched();
                        form.$setPristine(true);
                        document.getElementById("addClusterModal").style.display = "none";
                        $('.modal-backdrop').removeClass('modal-backdrop');
                        $state.reload();
                        body_paddingRemove();
                        }else{
                       //     return pop_alert();
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

        $scope.deleteClusterDetails = function(id) {
            $scope.id = id;
            clusterFactory.deleteClusterDetail($scope.id)
                .then(function(response) {
                    $scope.messages = {
                        success: [response.data]
                    };
                    $scope.getClusterDetails();
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
