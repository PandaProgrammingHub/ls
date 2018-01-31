angular.module('MyApp')
    .controller('sectionController', function($scope, $state, sectionFactory) {
        $scope.getSectionDetails = function() {
            sectionFactory.getSectionDetail()
                .then(function(response) {
                    $scope.sectionDetails = response.data.sections;
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
        $scope.getSectionDetails();

        function body_paddingRemove() {
            $('body').addClass('remove_rightpadding');
        }

        $scope.getSectionDetailsByID = function(id) {
            $scope.sectionID = id;
            sectionFactory.getSectionDetailByID($scope.sectionID)
                .then(function(response) {
                    $scope.sectionDetailsByid = response.data.section;
                    $scope.sectionDetailsByid.name = $scope.sectionDetailsByid.section_name;
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

        $scope.addSectionDetails = function(form) {
          $scope.errorMessage = '';
            if(form.$valid){
                sectionFactory.addSectionDetail($scope.addSectionData)
                    .then(function(response) {
                        if ((response.data.success) == true) {
                            $scope.messages = {
                                success: [response.data]
                            };
                            // $scope.getSectionDetails();
                            $scope.addSectionData = {};
                            form.$setUntouched();
                            form.$setPristine(true);
                            document.getElementById("addSectionModal").style.display = "none";
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

        $scope.cancelSection = function() {
          $scope.errorMessage = '';
            $scope.addSectionData = {};
        };

        $scope.editSectionDetails = function(form) {
            if(form.$valid) {
                sectionFactory.editSectionDetail($scope.sectionDetailsByid, $scope.sectionID)
                    .then(function (response) {
                        if ((response.data.success) == true) {
                            $scope.messages = {
                                success: [response.data]
                            };
                            $scope.sectionDetailsByid = {};
                            form.$setUntouched();
                            form.$setPristine(true);
                            document.getElementById("addSectionModal").style.display = "none";
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

        $scope.deleteSectionDetails = function(id) {
            $scope.id = id;
            sectionFactory.deleteSectionDetail($scope.id)
                .then(function(response) {
                    $scope.messages = {
                        success: [response.data]
                    };
                    $scope.getSectionDetails();
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
