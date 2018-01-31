angular.module('MyApp')
.factory('schoolUsersFactory', function($http) {
  return {
      getSchoolUsersBySchoolId: function(schoolId) {
        console.log("schoolId ",schoolId);        
        return $http.get('/api/schools/'+schoolId+'/users');
      },
      addSchoolUsers: function(schoolId,data) {       
        console.log("data ",data);        
        return $http.post('/api/schools/'+schoolId+'/users',data);
      },
      editSchoolUser: function(schoolId,userId,data) {     
        console.log("data ",data);        
        return $http.put('/api/schools/'+schoolId+"/users/"+userId,data);
      },
      getUserByUserId: function(schoolId,userId) {            
        return $http.get('/api/schools/'+schoolId+"/users/"+userId);
      },
      uploadUserList : function(schoolId,fileInput){
        var url = '/api/schools/'+schoolId+'/users/upload';
        var formaData = new FormData();
        formaData.append('file', fileInput);
        
        return $http.post(url, formaData, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
          file: fileInput
        });
      },

  };
});