angular.module('MyApp')
    .factory('managestudentsfactory', function ($http) {
        return {
            getmanageStudentsdetail: function (id, pageNumber,data) {

                if(angular.isUndefined(data)||data==null||data==""){
                    return $http.get('/api/schools/' + id + '/students?page=' + pageNumber);
                }else{
                var regularclassid = "";
                var name = "";
                var regulardivisionid = "";
                var elgastartclassid = "";
                var elgastartdivisionid = "";
                if (angular.isUndefined(data.regularclassid)) {

                } else {
                    regularclassid = data.regularclassid;
                }
                if (angular.isUndefined(data.regulardivisionid)) {

                } else {
                    regulardivisionid = data.regulardivisionid;
                }
                if (angular.isUndefined(data.name)) {

                } else {
                    name = data.name;
                }
                if (angular.isUndefined(data.elgastartclassid)) {

                } else {
                    elgastartclassid = data.elgastartclassid;
                }
                if (angular.isUndefined(data.elgastartdivisionid)) {

                } else {
                    elgastartdivisionid = data.elgastartdivisionid;
                }
                return $http.get('/api/schools/' + id + '/students?page=' + pageNumber + '&regular_class_id=' + regularclassid + '&student_name=' + name + '&regular_division_id=' + regulardivisionid + '&elgastart_class_id=' + elgastartclassid + '&elgastart_division_id=' + elgastartdivisionid);
            }
                // return $http.get('/api/students?schoolid=' + id + '&page=' + pageNumber);
            },
            getmanageStudentsdetailByID: function (schoolid,id) {
                return $http.get('/api/schools/' + schoolid+ '/students/' + id);
            },
            addstudentmanagementDetail: function (schoolid,data) {
                return $http.post('/api/schools/'+ schoolid+ '/students', data);
            },
            editStudentmanagementDetail: function (schoolid,id,data) {
                return $http.put('/api/schools/'+ schoolid+ '/students/' + id, data);
            },
            downloadFile: function (schoolid,data) {
                if(angular.isUndefined(data)||data==null||data==""){
                var downloadRequst = {
                     method: 'POST',
                     url: 'api/schools/'+schoolid+'/students/export/StudentList.xlsx',
                     headers: {
                        'Content-type': "application/json",
                        'Accept': "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                     },
                     responseType: 'arraybuffer'
                 }
     
                 return $http(downloadRequst);
               
                }else{
                    var regularclassid = "";
                    var name = "";
                    var regulardivisionid = "";
                    var elgastartclassid = "";
                    var elgastartdivisionid = "";
                    if (angular.isUndefined(data.regularclassid)) {
    
                    } else {
                        regularclassid = data.regularclassid;
                    }
                    if (angular.isUndefined(data.regulardivisionid)) {
    
                    } else {
                        regulardivisionid = data.regulardivisionid;
                    }
                    if (angular.isUndefined(data.name)) {
    
                    } else {
                        name = data.name;
                    }
                    if (angular.isUndefined(data.elgastartclassid)) {
    
                    } else {
                        elgastartclassid = data.elgastartclassid;
                    }
                    if (angular.isUndefined(data.elgastartdivisionid)) {
    
                    } else {
                        elgastartdivisionid = data.elgastartdivisionid;
                    }

                    var downloadRequst = {
                        method: 'POST',
                        url: 'api/schools/'+schoolid+'/students/export/StudentList.xlsx?regular_class_id='+ regularclassid + '&student_name=' + name + '&regular_division_id=' + regulardivisionid + '&elgastart_class_id=' + elgastartclassid + '&elgastart_division_id=' + elgastartdivisionid,
                        headers: {
                           'Content-type': "application/json",
                           'Accept': "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        },
                        responseType: 'arraybuffer'
                    }
        
                    return $http(downloadRequst);
                }

             }
            
        };
    });

