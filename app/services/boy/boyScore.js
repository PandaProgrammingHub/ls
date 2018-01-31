angular.module('MyApp')
    .factory('boyScoreFactory', function ($http) {
        return {
            getBoyScoreDetail: function (schoolId) {
                return $http.get('/api/boyElgaAssessment?school_id=' + schoolId + '');
            },

            getBoyScoreFilterDetail: function (schoolId, query_params) {
                var url = '/api/boyElgaAssessment?school_id=' + schoolId + '';
                return $http({
                    url: url,
                    method: 'GET',
                    params: query_params
                });
            },

            getLiteacylevelDetail: function () {
                return $http.get('api/classes');
            },
            
            getClassDivDetails: function (schoolId) {
                return $http.get('/api/schools/'+ schoolId +'/classesanddivisions');
            },

            getBoyDetailSubmit: function (data, admissionId) {
                console.log(data);
                return $http.put('/api/boyElgaAssessment/' + admissionId + '',data);
            },

            deletStudenBOYDetails: function (admissionId) {
                return $http.delete('/api/boyElgaAssessment/' + admissionId + '');
            }
        };
    });