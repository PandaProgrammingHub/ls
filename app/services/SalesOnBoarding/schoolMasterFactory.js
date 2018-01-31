angular.module('MyApp')
.factory('schoolMasterFactory', function($http,$httpParamSerializerJQLike) {
  return {
      getSchoolSalesList:function(){
        return $http.get('/api/schools/salesList');
      },    
      deactiveSchool: function(schoolId) {       
        return $http.put('/api/schools/'+schoolId+'/deactivate');
      },
      activeSchool: function(schoolId) {       
        return $http.put('/api/schools/'+schoolId+'/activate');
      },
      getSchoolBasicInfo:function(schoolId){
        return $http.get('/api/schools/'+schoolId);
      },
      addSchools: function(data) {     
        var url = '/api/schools';        
        var formaData = new FormData();
        formaData.append('coverImage', data.coverImage);        
        formaData.append('logo', data.logo);
        formaData.append('acadyear', data.acadyear);        
        formaData.append('address1', data.address1);        
        formaData.append('address2', data.address2);        
        formaData.append('admin_mobile', data.admin_mobile);
        formaData.append('city', data.city);        
        formaData.append('cluster', data.cluster);        
        formaData.append('email', data.email);        
        formaData.append('established', data.established);        
        formaData.append('home_phone', data.home_phone);        
        formaData.append('mission', data.mission);        
        formaData.append('name', data.name);        
        formaData.append('newspaper', data.newspaper);        
        formaData.append('pincode', data.pincode);        
        formaData.append('school_chain', data.school_chain);        
        formaData.append('school_type', data.school_type);        
        formaData.append('state', data.state);        
        formaData.append('vision', data.vision);        
        formaData.append('website', data.website);        
        formaData.append('yearBook', data.yearBook);        
        return $http.post(url, formaData, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
          file: data
        });
      },
      editSchoolBasicInfo: function(id,data) {     
        var url = '/api/schools/'+id;        
        var formaData = new FormData();
        formaData.append('coverImage', data.coverImage);        
        formaData.append('logo', data.logo);
        formaData.append('acadyear', data.acadyear);        
        formaData.append('address1', data.address1);        
        formaData.append('address2', data.address2);        
        formaData.append('admin_mobile', data.admin_mobile);
        formaData.append('city', data.city);        
        formaData.append('cluster', data.cluster);        
        formaData.append('email', data.email);        
        formaData.append('established', data.established);        
        formaData.append('home_phone', data.home_phone);        
        formaData.append('mission', data.mission);        
        formaData.append('name', data.name);        
        formaData.append('newspaper', data.newspaper);        
        formaData.append('pincode', data.pincode);        
        formaData.append('school_chain', data.school_chain);        
        formaData.append('school_type', data.school_type);        
        formaData.append('state', data.state);        
        formaData.append('vision', data.vision);        
        formaData.append('website', data.website);        
        formaData.append('yearBook', data.yearBook);        
        return $http.put(url, formaData, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
          file: data
        });
      },
      getSchoolClassConfig:function(schoolId){
        return $http.get('/api/schools/'+schoolId+'/schoolClassConfig');
      },   
      addSchoolClassConfig:function(data){
        return $http.post('/api/schoolClassConfig',data);
      },
      getSchoolContentConfig:function(schoolId){
        return $http.get('/api/schoolSubjectConfig?school_id='+schoolId);
      },   
      addSchoolContentConfig:function(data){
        return $http.post('/api/schoolSubjectConfig',data);
      },  
      searchSchoolSalesList:function(data){
        console.log("data");
        console.log(data);
        return $http.get('/api/schools/salesList?'+data);
      },    
  };
});