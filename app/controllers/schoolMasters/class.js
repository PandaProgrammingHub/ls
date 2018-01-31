angular.module('MyApp')
    .controller('classController', function($scope, $state, classFactory,subjectFactory) {

        $scope.subject_ids = [];
    //    $scope.subShow = true;
        

        $scope.getClassDetails = function() {
            classFactory.getClassDetail()
                .then(function(response) {
                    $scope.classDetails = response.data.classes;
                    console.log($scope.classDetails);
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
        $scope.getClassDetails();

        function body_paddingRemove() {
            $('body').addClass('remove_rightpadding');
        }

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
        
        $scope.getClassDetailsByID = function(id) {
            $scope.classID = id;
            classFactory.getClassDetailByID($scope.classID)
                .then(function(response) {
                  $scope.classDetailsByid = response.data.class;
                  response.data.class.subjects.forEach(function (subject) {
                    $scope.subject_ids.push(subject.subject_id);
                  });
                  if($scope.classDetailsByid.class_type == 'elga'){
                    $scope.subShow = false;              
                  }else{
                    $scope.subShow = true;                
                  }
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

        $scope.addClassDetails = function(form) {
          $scope.errorMessage = '';
            if(form.$valid){
                if($scope.subject_ids.length > 0){
                    $scope.addClassData.subject_ids = $scope.subject_ids;
                }
                classFactory.addClassDetail($scope.addClassData)
                    .then(function(response) {
                        if ((response.data.success) == true) {
                        $scope.messages = {
                            success: [response.data]
                        };
                        // $scope.getClassDetails();
                        $scope.addClassData = {};
                        form.$setUntouched();
                        form.$setPristine(true);
                        document.getElementById("addClassModal").style.display = "none";
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

        $scope.cancelClass = function() {
            $scope.errorMessage = '';
            $scope.addClassData = {};
            $scope.subject_ids  = [];
            $scope.classDetailsByid = {};
        
        };

          $scope.editClassDetails = function(form) {
            if(form.$valid) {
                if($scope.subject_ids.length > 0){
                    $scope.classDetailsByid.subject_ids = $scope.subject_ids;
                }
                classFactory.editClassDetail($scope.classDetailsByid, $scope.classID)
                    .then(function (response) {
                        if ((response.data.success) == true) {
                        $scope.messages = {
                            success: [response.data]
                        };
                        $scope.classDetailsByid = {};
                        form.$setUntouched();
                        form.$setPristine(true);
                        document.getElementById("addClassModal").style.display = "none";
                        $('.modal-backdrop').removeClass('modal-backdrop');
                        $state.reload();
                        body_paddingRemove();
                    }
                    else{
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

        $scope.deleteClassDetails = function(id) {
            $scope.id = id;
            classFactory.deleteClassDetail($scope.id)
                .then(function(response) {
                    $scope.messages = {
                        success: [response.data]
                    };
                    $scope.getClassDetails();
                })
                .catch(function(response) {
                    $scope.messages = {
                        error: Array.isArray(response.data) ? response.data : [response.data]
                    };
                });
        };
        $scope.classtypeChange = function(classType){
            //console.log(classType);
             if(classType == 'elga'){
                 $scope.subShow = false;
             } else{
                $scope.subShow = true;
                
             }
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
