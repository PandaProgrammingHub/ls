angular.module('MyApp')
.controller('SchoolContentConfigController', function($scope, _ ,$rootScope, $location, $window, Account,$stateParams,$state,schoolMasterFactory,boardFactory) {
  $scope.contentConfigRegularClassesArray = [];
  $scope.contentConfigElgaClassesArray = [];
  $scope.schoolId = $stateParams.schoolId;
  $scope.schoolname = $stateParams.schoolname;
  $scope.hasSchoolContentConfig;  
  $scope.isExists = function(arr,class_id) {
    return arr.some(function(el) {
      return el.class.id === class_id;
    }); 
  };
  $scope.contentconfig = {};
  $scope.rSUSVValues;
  $scope.returnSubjectUnitSquenceVersionObj = function(arr,class_id){
    var indx = _.findIndex(arr, ['class_id', class_id]);
    if(indx !== -1){
        console.log(indx);
        console.log(arr[indx]);
    return arr[indx];
   
    }

    // // => 0

    //   //console.log("dsksj");
    //   angular.forEach(arr, function (value, key) {
    //   //    console.log('VALUE>>>>>', value)
    //       if(value.class.id == class_id){
    //        //   console.log("valuer"+value);
    //           $scope.rSUSVValues =  value;          
    //       }
    //   });    
  };
  $scope.getBoardMaster = function() {
    boardFactory.getBoardDetail()
        .then(function(response) {
            $scope.boardMasters = response.data.board;
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
$scope.getSchoolContentConfig = function() {
    schoolMasterFactory.getSchoolContentConfig($scope.schoolId)
        .then(function(response) {   
            console.log(response.data.school_content);       
             if(_.isEmpty(response.data.school_content)){
                $scope.hasSchoolContentConfig = false;            
            }else{
                $scope.hasSchoolClassConfig = true;              
            }
           console.log($scope.hasSchoolClassConfig);
            $scope.schoolContentConfig       = response.data.school_content;
            $scope.classesMaster             = response.data.masters.classes;
            $scope.subjectsMaster            = response.data.masters.subjects;
         //   $scope.contentconfig.schoolBoard = (_.isEmpty(response.data.school_content[0].board_id))?$scope.schoolContentConfig[0].board_id.toString():null; 
            
            var subjectRegularArray = [];
            var subjectElgaArray = [];
            angular.forEach($scope.classesMaster, function (value, key) {
              //  console.log(value); 
                if(value.class_type == 'regular'){
                    angular.forEach(value.subjects, function (v, k) {
                        var subjectSearchFromSubjectMaster = $scope.subjectsMaster.filter(function(item) {
                            return item.id === v.subject_id;
                          })[0];
                        var subobj = {
                            sub_id   :  v.subject_id,
                            sub_name :  subjectSearchFromSubjectMaster.name,
                        }
                        subjectRegularArray.push(subobj);
                    });
                 //  var exists = ($scope.hasSchoolContentConfig)?$scope.isExists($scope.schoolContentConfig,value.id):false;
                    var exists = $scope.isExists($scope.schoolContentConfig,value.id);
                    //var rSUSVObj = ($scope.hasSchoolContentConfig)?$scope.returnSubjectUnitSquenceVersionObj($scope.schoolContentConfig,value.id):'';
                    var rSUSVObj = $scope.returnSubjectUnitSquenceVersionObj($scope.schoolContentConfig,value.id);
                 //   console.log(rSUSVObj);
                    var obj = {
                        class_id:value.id,
                        name:value.name,
                        subjects:subjectRegularArray,
                        subject_id:(rSUSVObj)?rSUSVObj.subject_id.toString():null,
                        unit_sequence_id:(rSUSVObj)?rSUSVObj.unit_sequence_id.toString():null,
                        checked : exists,

                    }
                    $scope.contentConfigRegularClassesArray.push(obj);
                }                
            });
            angular.forEach($scope.classesMaster, function (value, key) {
                if(value.class_type == 'elga'){
                    angular.forEach(value.subjects, function (v, k) {
                        var subjectSearchFromSubjectMaster = $scope.subjectsMaster.filter(function(item) {
                            return item.id === v.subject_id;
                          })[0];
                        var subobj = {
                            sub_id   :  v.subject_id,
                            sub_name :  subjectSearchFromSubjectMaster.name,
                        }
                        subjectElgaArray.push(subobj);
                    });
                  //  var exists = ($scope.hasSchoolContentConfig)?$scope.isExists($scope.schoolContentConfig,value.id):'';                    
                    var exists = $scope.isExists($scope.schoolContentConfig,value.id);                    
                   // var rSUSVObj = ($scope.hasSchoolContentConfig)?$scope.returnSubjectUnitSquenceVersionObj($scope.schoolContentConfig,value.id):'';
                    var rSUSVObj = $scope.returnSubjectUnitSquenceVersionObj($scope.schoolContentConfig,value.id);
                   // console.log(rSUSVObj);                    
                    var objj = {
                    class_id:value.id,
                    name:value.name,
                    subjects:subjectElgaArray,
                    unit_sequence_id:(rSUSVObj)?rSUSVObj.unit_sequence_id.toString():null,
                    checked : exists,                    
                }
                $scope.contentConfigElgaClassesArray.push(objj);
            }
            });
            console.log($scope.contentConfigRegularClassesArray);
            console.log($scope.contentConfigElgaClassesArray);
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

$scope.getBoardMaster();
$scope.getSchoolContentConfig(); 
  $scope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
        input.push(i);
    }
    return input;
  };

  $scope.regularClasses = [];
  $scope.elgaClasses = [];
  $scope.changeRegularClasses = function(val){
      console.log(val);
      if(val.subject_id == null || val.unit_sequence_id == null){
          val.SELECTED = "N";
          val.checked = false;
          $window.alert("Please choose Subject and Unit Sequence Version.");
      }else{
    var indexOfDay = $scope.regularClasses.indexOf(val); 
        if(indexOfDay === -1) {
            $scope.regularClasses.push(val)
        } else {
            $scope.regularClasses.splice(indexOfDay, 1)
        }
    }
     };
  $scope.changeElgaClasses = function(val){
    console.log(val);
    if(val.unit_sequence_id == null){
        val.SELECTED = "N";
        val.checked = false;
        $window.alert("Please choose Unit Sequence Version.");
    }else{
      var indexOfDay = $scope.elgaClasses.indexOf(val); 
          if(indexOfDay === -1) {
              $scope.elgaClasses.push(val)
          } else {
              $scope.elgaClasses.splice(indexOfDay, 1)
          }
        }
       };
  $scope.contentConfig = function(contentConfigForm) { 
    var isFormValid = true;
    angular.forEach(contentConfigForm.$error.required, function (field) {
      field.$setDirty();
      isFormValid = false;
    });
    if (contentConfigForm.$valid && isFormValid) {
     $scope.contentConfigResult = {
      school_id:$scope.schoolId,
      board_id:parseInt($scope.contentconfig.schoolBoard),
      regularClasses:$scope.regularClasses,
      elgaClasses:$scope.elgaClasses,
     }
     console.log($scope.contentConfigResult);
     schoolMasterFactory.addSchoolContentConfig($scope.contentConfigResult)
     .then(function (response) {
         $scope.messages = {
             success: [response.data]
         };
         $scope.addSchoolContentConfigMsg = response.data.msg;
         $window.alert($scope.addSchoolContentConfigMsg);
         
     
     })
     .catch(function (response) {
         $scope.messages = {
             error: Array.isArray(response.data) ? response.data : [response.data]
         };
     });
    } else{
      return false;
    }
   };
   $scope.showMessage = function(input) {
    var show = input.$invalid && (input.$dirty || input.$touched);
    return show;
  };
});