angular.module('MyApp').controller('EditManagestudentsController', function ($scope, $rootScope, Account, $stateParams, $state, managestudentsfactory,pincodeFactory,classDivisionFactory) {
    $scope.schoolId = $stateParams.schoolId;
    $scope.student_id = $stateParams.student_id;
    $scope.schoolname = $stateParams.schoolname;
    $scope.blank='';
//  console.log($scope.schoolname);
//  console.lconsoleog($scope.student_id);
//  $scope.name = "John Doe";
 $scope.showCityState = true;
    $scope.EditManagestudentsData = function () {
        $scope.bloodgroup = [{
            name: "A+"
          }, {
            name: "A-"
          }, {
            name: "B+"
          }, {
            name: "B-"
          },{
            name: "O+"
          }, {
            name: "O-"
          }, {
            name: "AB+"
          }, {
            name: "AB-"
          }];
        $scope.status = [{
            id: "inactive",
            name: "Inactive"
          }, {
            id: "active",
            name: "Active"
          }, {
            id: "completed",
            name: "Completed"
          }, {
            id: "trasferred",
            name: "Trasferred"
          }];
        managestudentsfactory.getmanageStudentsdetailByID($scope.schoolId,$scope.student_id)
            .then(function (response) {
                $scope.editstudentsDetails = response.data.students;
                $scope.checkPinCode($scope.editstudentsDetails.pincode);
// if($scope.studentsDetails!=""&&$scope.studentsDetails!=null&&$scope.editstudentsDetails.sa.length!=0){
                //     if($scope.editstudentsDetails.sa[0].admissiondate!=""&&$scope.editstudentsDetails.sa[0].admissiondate!=null){
                    var adate=$scope.editstudentsDetails.sa[0].admissiondate.split("T")[0];
                    console.log(adate);
                    $scope.editstudentsDetails.sa[0].admissiondate=new Date(adate.split("-")[0], adate.split("-")[1]-1, adate.split("-")[2]);
                //     }
                // }

                // if($scope.studentsDetails==""||$scope.editstudentsDetails.dateofbirth==""
            // ||$scope.studentsDetails==null||$scope.editstudentsDetails.dateofbirth==null){
                
            //     }else{
                    var dob=$scope.editstudentsDetails.dateofbirth.split("T")[0];
                    console.log(dob);
                    $scope.editstudentsDetails.dateofbirth=new Date(dob.split("-")[0], dob.split("-")[1]-1, dob.split("-")[2]);
                // }
                
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
    $scope.EditManagestudentsData();

    $scope.checkPinCode = function(pincode){
        pincodeFactory.getPincodeDetails(pincode)
        .then(function(response) {
            $scope.pincodeDetails = response.data.pincode;
            $scope.messages = { success: [response.data] };
            $scope.uniqueStates = [];
           
            for(i = 0; i< $scope.pincodeDetails.length; i++){    
                if($scope.uniqueStates.indexOf($scope.pincodeDetails[i].state) === -1){
                    $scope.uniqueStates.push($scope.pincodeDetails[i].state);        
                }        
            }
           
            $scope.showCityState = false;
        })
        .catch(function(response) {
            $scope.messages = {
                error: Array.isArray(response.data) ? response.data : [response.data]
            };
        });
    }
  
   
    // $scope.getClassDetails = function() {
    //     classFactory.getClassDetail()
    //         .then(function(response) {
    //             $scope.classDetails = response.data.classes;
    //             $scope.regularclass=[];
    //             $scope.elgaclass=[];
    //             // console.log($scope.classDetails);
    //             for(i = 0; i< $scope.classDetails.length; i++){    
    //                 if($scope.classDetails[i].class_type=="regular"){
    //                     $scope.regularclass.push($scope.classDetails[i]);     
    //                 }else{
    //                     $scope.elgaclass.push($scope.classDetails[i]);
    //                 }       
    //             }
    //             $scope.messages = {
    //                 success: [response.data]
    //             };
    //         })
    //         .catch(function(response) {
    //             $scope.messages = {
    //                 error: Array.isArray(response.data) ? response.data : [response.data]
    //             };
    //         });
    // };
    // $scope.getClassDetails();

    // $scope.getSectionDetails = function() {
    //     divisionFactory.getDivisionDetail()
    //         .then(function(response) {
    //             $scope.sectionDetails = response.data.divisions;
    //             // console.log($scope.sectionDetails);
    //             $scope.messages = {
    //                 success: [response.data]
    //             };
    //         })
    //         .catch(function(response) {
    //             $scope.messages = {
    //                 error: Array.isArray(response.data) ? response.data : [response.data]
    //             };
    //         });
    // };
    // $scope.getSectionDetails();

    $scope.getClassDetails = function () {
        classDivisionFactory.getClassDivisionDetail($scope.schoolId)
            .then(function (response) {
                // console.log(response);
                $scope.classDetails = response.data;
                $scope.regularclass = [];
                $scope.elgaclass = [];
                $scope.sectionDetails_regular = [];
                $scope.sectionDetails_elga = [];
                if ($scope.classDetails.length != 0) {
                    for (i = 0; i < $scope.classDetails.length; i++) {
                        if ($scope.classDetails[i].type == "regular") {
                            $scope.regularclass.push($scope.classDetails[i]);
                            if ($scope.classDetails[i].divs.length != 0) {
                                for (j = 0; j < $scope.classDetails[i].divs.length; j++) {
                                    if ($scope.checkValue($scope.classDetails[i].divs[j].id, $scope.sectionDetails_regular) == true) {
                                        $scope.sectionDetails_regular.push($scope.classDetails[i].divs[j]);
                                    }
                                }
                            }
                        } else {
                            $scope.elgaclass.push($scope.classDetails[i]);
                            if ($scope.classDetails[i].divs.length != 0) {
                                for (j = 0; j < $scope.classDetails[i].divs.length; j++) {
                                    if ($scope.checkValue($scope.classDetails[i].divs[j].id, $scope.sectionDetails_elga) == true) {
                                        $scope.sectionDetails_elga.push($scope.classDetails[i].divs[j]);
                                    }
                                }
                            }
                        }
                        
                    }
                    // console.log($scope.regularclass);
                    // console.log($scope.elgaclass);
                    // console.log($scope.sectionDetails);
                }
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
    $scope.getClassDetails();
    $scope.checkValue = function (value, arr) {
        var status = true;
        if (arr.length != 0) {
            for (var i = 0; i < arr.length; i++) {
                var name = arr[i].id;
                if (name == value) {
                    status = false;
                    break;
                }
            }
        }
        return status;
    }


    $scope.editstudentBasicProfile = function (studentBasicProfileForm) {
        console.log($scope.editstudentsDetails);
        var isFormValid = true;
        angular.forEach(studentBasicProfileForm.$error.required, function (field) {
          field.$setDirty();
          isFormValid = false;
        });
        if (studentBasicProfileForm.$valid && isFormValid) {
        managestudentsfactory.editStudentmanagementDetail($scope.schoolId,$scope.student_id,$scope.editstudentsDetails)
        .then(function(response) {
            console.log(response);
            $sucess=response.data.success;
            if($sucess==true){
                alert("Student edited successfully");
            }else{
                alert("Failure in student edition");
            }
           
        }) .catch(function(response) {
            $scope.messages = {
                error: Array.isArray(response.data) ? response.data : [response.data]
            };
        });
    }else{
        return false;
      }
        
    };
    $scope.showMessage = function(input) {
        var show = input.$invalid && (input.$dirty || input.$touched);
        return show;
      };
    
});




