angular.module('MyApp')
    .factory('studentpromotionfactory', function ($http) {
        return {
            getStudentsdetail: function (schoolid,data) {
                if(angular.isUndefined(data)||data==null||data==""){
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
                return $http.get('/api/studentpromotions?school_id=' + schoolid + '&page=' + 1 + '&class_id=' + regularclassid + '&student_name=' + name + '&division_id=' + regulardivisionid + '&elga_class_id=' + elgastartclassid + '&elga_division_id=' + elgastartdivisionid);
                    // return $http.get('/api/studentpromotions?school_id=' + schoolid);
            }
        }, 
            promotesstudent: function (data) {
                return $http.put('/api/studentpromotions', data);
            }
           
        };
    });

