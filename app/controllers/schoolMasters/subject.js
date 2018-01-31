angular.module('MyApp')
.controller('subjectController', function($scope, $state, subjectFactory) {
    $scope.getSubjectDetails = function() {
        subjectFactory.getSubjectDetail()
            .then(function(response) {
                $scope.subjectDetails = response.data.subjects;
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
    $scope.getSubjectDetails();

    function body_paddingRemove() {
        $('body').addClass('remove_rightpadding');
    }

    $scope.getSubjectDetailsByID = function(id) {
        $scope.subjectID = id;
        subjectFactory.getSubjectDetailByID($scope.subjectID)
            .then(function(response) {
                $scope.subjectDetailsByid = response.data.subject;
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

    $scope.addSubjectDetails = function(form) {
      $scope.errorMessage = '';
        if(form.$valid){
            subjectFactory.addSubjectDetail($scope.addSubjectData)
                .then(function(response) {
                    if ((response.data.success) == true) {
                        $scope.messages = {
                            success: [response.data]
                        };
                        $scope.addSubjectData = {};
                        form.$setUntouched();
                        form.$setPristine(true);
                        document.getElementById("addSubjectModal").style.display = "none";
                        $('.modal-backdrop').removeClass('modal-backdrop');
                        $state.reload();
                        body_paddingRemove();
                    }
                    else{
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

    $scope.cancelSubject = function() {
      $scope.errorMessage = '';
      $scope.addSubjectData = {};
    };

    $scope.editSubjectDetails = function(form) {
        if(form.$valid) {
            subjectFactory.editSubjectDetail($scope.subjectDetailsByid, $scope.subjectID)
                .then(function (response) {
                if ((response.data.success) == true) {
                    $scope.messages = {
                        success: [response.data]
                    };
                    $scope.subjectDetailsByid = {};
                    form.$setUntouched();
                    form.$setPristine(true);
                    document.getElementById("addSubjectModal").style.display = "none";
                    $('.modal-backdrop').removeClass('modal-backdrop');
                    $state.reload();
                    body_paddingRemove();
                }else{
                   // return pop_alert();
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

    $scope.deleteSubjectDetails = function(id) {
        $scope.id = id;
        subjectFactory.deleteSubjectDetail($scope.id)
            .then(function(response) {
                $scope.messages = {
                    success: [response.data]
                };
                $scope.getSubjectDetails();
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

