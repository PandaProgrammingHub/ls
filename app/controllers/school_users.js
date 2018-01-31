angular.module('MyApp')
.controller('SchoolUsersController', function($scope, _ ,$rootScope, $location, $window, Account,$stateParams,$state,schoolUsersFactory,roleFactory,designationFactory) {
//  console.log("schoolId===="+$stateParams.schoolId);
$scope.schoolId = $stateParams.schoolId;
$scope.schoolname = $stateParams.schoolname;
$scope.schooluser = {
    school_id:$scope.schoolId
};
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
$scope.getdesignationDetails = function() {
    designationFactory.getDesignationDetail()
        .then(function(response) {
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
$scope.getSchoolUsersBySchoolId = function () {
    schoolUsersFactory.getSchoolUsersBySchoolId($scope.schoolId)
        .then(function (response) {
            $scope.schoolUsers = response.data.users_details;
            $scope.messages = {
                success: [response.data]
            };
            console.log($scope.schoolUsers);
        })
        .catch(function (response) {
            $scope.messages = {
                error: Array.isArray(response.data) ? response.data : [response.data]
            };
        });
};
$scope.getSchoolUsersBySchoolId();
$scope.getRoleDetails();
$scope.getdesignationDetails();
$scope.returnRoleName = function(role_id){
    var role_id = parseInt(role_id);
    var indx = _.findIndex($scope.roleDetails, ['id', role_id]);
    if(indx !== -1){
    return $scope.roleDetails[indx].role_name;   
    } else{
    return "Undefined";     
    }
};
$scope.addU = function(){
    $scope.schooluser = {};
    $scope.errorMessage = '';
    
};
$scope.addSchoolUsers = function(form){
    if(form.$valid){
        console.log($scope.schooluser);
        schoolUsersFactory.addSchoolUsers($scope.schoolId,$scope.schooluser)
        .then(function (response) {
            console.log("I am in response part");            
            if ((response.data.success) == true) {
            console.log("I am in true part");
            
            console.log(response);
            $scope.messages = {
                success: [response.data]
            };
         //   $scope.addSchoolUsersFactoryData = response.data.documents_details;
         form.$setUntouched();
         form.$setPristine(true);
         document.getElementById("addSchoolUsers").style.display = "none";
         $('.modal-backdrop').removeClass('modal-backdrop');
         $state.reload();
         body_paddingRemove();
        }else{
            console.log("I am in false part");
            $scope.errorMessage = response.data.msg;
      }
        })
        .catch(function (response) {
            console.log("I am in catch part");
            $scope.errorMessage = response.data.msg;            
            $scope.messages = {
                error: Array.isArray(response.data) ? response.data : [response.data]
            };
        });
        
    }
}


$scope.editSchoolUsers = function (form) {
    if (form.$valid) {
        
        schoolUsersFactory.editSchoolUser($scope.schoolId,$scope.userId,$scope.schooluser)
            .then(function (response) {
                if ((response.data.success) == true) {
                $scope.messages = {
                    success: [response.data]
                };
                $scope.editUserData = response.data.user;
                form.$setUntouched();
                form.$setPristine(true);
                document.getElementById("editSchoolUsers").style.display = "none";
                $('.modal-backdrop').removeClass('modal-backdrop');
                $state.reload();
                body_paddingRemove();
            }else{
                console.log("I am in false part");            
                $scope.errorMessage = response.data.msg;
          }
            
            })
            .catch(function (response) {
                console.log("I am in catch part");
                $scope.errorMessage = response.data.msg;
                $scope.messages = {
                    error: Array.isArray(response.data) ? response.data : [response.data]
                };
            });
    }

};

  $scope.schooUserEdit = function($index){
    $scope.userId = $index;   
   $scope.getUserByUserID($index);
   console.log("school_user");
   console.log($index);
  }
 
//   // get paytemt by paymentId
  $scope.getUserByUserID = function (id) {
    schoolUsersFactory.getUserByUserId($scope.schoolId,id)
        .then(function (response) {
           $scope.schooluser = response.data.user;
           $scope.schooluser.mobile = Number(response.data.user.mobile);
           $scope.schooluser.access_till = new Date(response.data.user.access_till);
           console.log($scope.schooluser);
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
$scope.uploadFile= function(fileInput) {
    schoolUsersFactory.uploadUserList($scope.schoolId,fileInput)
    .then(function (response) {
        // $scope.messages = {
        //     success: [response.data]
        // };
       // $scope.uploadUserListData = response.data.documents_details;
    
    })
    .catch(function (response) {
        $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
        };
    });
}
// function formatDate(date) {
//     var dateString = date.toDateString();
//     return dateString.slice(4, 7) + ' ' + date.getFullYear();
//   }
  

function body_paddingRemove() {
    $('body').addClass('remove_rightpadding');
}

});
