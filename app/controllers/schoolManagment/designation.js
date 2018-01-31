angular.module('MyApp')
.controller('designationController', function($scope, $state, designationFactory) {
    $scope.getDesignationDetails = function() {
        designationFactory.getDesignationDetail()
            .then(function(response) {
                console.log(response.data);
                $scope.designationDetails = response.data.data;
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
    $scope.getDesignationDetails();

    function body_paddingRemove() {
        $('body').addClass('remove_rightpadding');
    }

    $scope.getDesignationDetailsByID = function(id) {
        $scope.designationID = id;
        designationFactory.getDesignationDetailByID($scope.designationID)
            .then(function(response) {
                $scope.designationDetailsByid = response.data.data;
                console.log("pop ka data" + response.data.data);
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

    $scope.addDesignationDetails = function(form) {
        $scope.errorMessage = '';
        if(form.$valid){
            designationFactory.addDesignationDetail($scope.addDesignationData)
                .then(function(response) {
                    if ((response.data.success) == true) {
                    $scope.messages = {
                        success: [response.data]
                    };
                    // $scope.getDesignationDetails();
                    $scope.addDesignationData = {};
                    form.$setUntouched();
                    form.$setPristine(true);
                    document.getElementById("addDesignationModal").style.display = "none";
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

    $scope.cancelDesignation = function() {
        $scope.addDesignationData = {};
    };

    $scope.editDesignationDetails = function(form) {
        $scope.errorMessage = '';
        if(form.$valid) {
            designationFactory.editDesignationDetail($scope.designationDetailsByid, $scope.designationID)
                .then(function (response) {
                    if ((response.data.success) == true) {
                    $scope.messages = {
                        success: [response.data]
                    };
                    $scope.designationDetailsByid = {};
                    form.$setUntouched();
                    form.$setPristine(true);
                    document.getElementById("addDesignationModal").style.display = "none";
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

    $scope.deleteDesignationDetails = function(id) {
        $scope.id = id;
        designationFactory.deleteDesignationDetail($scope.id)
            .then(function(response) {
                $scope.messages = {
                    success: [response.data]
                };
                $scope.getDesignationDetails();
            })
            .catch(function(response) {
                $scope.messages = {
                    error: Array.isArray(response.data) ? response.data : [response.data]
                };
            });
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
