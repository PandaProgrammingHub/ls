angular.module('MyApp')
.factory('schoolPaymentFactory', function($http) {
  return {
    getPaymentsBySchoolID: function(schoolId) {
        console.log("schoolId ",schoolId);
        return $http.get('/api/schools/'+schoolId+'/payments');
    },
     
    addPayment: function(schoolId,data) {
        console.log("schoolId ",schoolId);
        console.log("document ",data);        
          return $http.post('/api/schools/'+schoolId+'/payments',data);
    },
    getPayment: function(id) {            
      return $http.get('/api/payments/'+id);
    },
    editPayment: function(id,data) {     
      console.log("data ",data);        
      return $http.put('/api/payments/'+id,data);
    },
    downloadInvoice: function(id) {            
      return $http.get('/api/payments/'+id+'/download');
    },
      
  };
});