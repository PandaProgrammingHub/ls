var MyApp = angular.module('MyApp')
.controller('SchoolPaymentListController', function($scope,$filter,$rootScope, $location, $window, Account,$stateParams,$state,schoolPaymentFactory) {
  $scope.schoolId = $stateParams.schoolId;
  $scope.schoolname = $stateParams.schoolname;
  $scope.selectedPaymentId; 
  $scope.showModal = false;
//console.log("schoolId===="+$stateParams.schoolId);
$scope.addpayment = {
    pay_mode_id : 1,
}
$scope.getPaymentsBySchoolID = function () {
    schoolPaymentFactory.getPaymentsBySchoolID($scope.schoolId)
        .then(function (response) {
           // console.log(response.data.payment_details);
           $scope.paymentLists = response.data.payment_details;
            $scope.messages = {
                success: [response.data]
            };
            console.log($scope.paymentLists);
        })
        .catch(function (response) {
            $scope.messages = {
                error: Array.isArray(response.data) ? response.data : [response.data]
            };
        });
};
$scope.getPaymentsBySchoolID();

$scope.addPayment = function (form) {
    if (form.$valid) {
        console.log("addpayment");
        console.log($scope.addpayment);
        schoolPaymentFactory.addPayment($scope.schoolId,$scope.addpayment)
            .then(function (response) {
                $scope.messages = {
                    success: [response.data]
                };
                $scope.addPaymentData = response.data.payments_details;
                $state.reload();
            
            })
            .catch(function (response) {
                $scope.messages = {
                    error: Array.isArray(response.data) ? response.data : [response.data]
                };
            });
    }

};

$scope.editPaymentDetails = function (form) {
    if (form.$valid) {
        console.log("paymentId="+$scope.paymentId);
        schoolPaymentFactory.editPayment($scope.paymentId,$scope.payment)
            .then(function (response) {
                $scope.messages = {
                    success: [response.data]
                };
                $scope.editPaymentData = response.data.payments_details;
               $state.reload();
            
            })
            .catch(function (response) {
                $scope.messages = {
                    error: Array.isArray(response.data) ? response.data : [response.data]
                };
            });
    }

};

  $scope.editPaymentList = function($index){
    $scope.paymentId = $index;   
   $scope.getPaymentByPaymentID($index);
  }
  $scope.downloadInvoice = function($index){
    $state.go('school_payment_invoice_download',{schoolId:$index});    
    // schoolPaymentFactory.downloadInvoice(id)
    // .then(function (response) {      
    //     $scope.messages = {
    //         success: [response.data]
    //     };
       
    // })
    // .catch(function (response) {
    //     $scope.messages = {
    //         error: Array.isArray(response.data) ? response.data : [response.data]
    //     };
    // });

  }
 
//   // get paytemt by paymentId
  $scope.getPaymentByPaymentID = function (id) {
    schoolPaymentFactory.getPayment(id)
        .then(function (response) {
           $scope.payment = response.data.payment_details;
           console.log($scope.payment);
           $scope.payment.amount = parseInt($scope.payment.amount);
            $scope.messages = {
                success: [response.data]
            };
            console.log($scope.payment);
        })
        .catch(function (response) {
            $scope.messages = {
                error: Array.isArray(response.data) ? response.data : [response.data]
            };
        });
};

});

