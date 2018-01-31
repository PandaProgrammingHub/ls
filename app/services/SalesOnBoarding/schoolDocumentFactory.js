angular.module('MyApp')
.factory('schoolDocumentFactory', function($http) {
  return {
    getDocumentsBySchoolID: function(schoolId) {
        console.log("schoolId ",schoolId);
        return $http.get('/api/schools/'+schoolId+'/documents');
    },
     
    addDocument: function(schoolId,data) {        
        //console.log("document ",data); 
        var url = '/api/schools/'+schoolId+'/documents';        
        var formaData = new FormData();
        formaData.append('file', data.document);
        formaData.append('doc_id', 222);
        formaData.append('document_url', 'http://www.mobinexttech.com/wp-content/themes/mobinexttech/images/logo.png');
        formaData.append('document_type', data.document_type);
        
        return $http.post(url, formaData, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
          file: data
        });
       
    },
      
  };
});