angular.module('MyApp', ['satellizer', 'ui.bootstrap' ,'ui.router', 'ngMessages','checklist-model'])
  .config(function ($locationProvider, $authProvider, $stateProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise("/login");

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'partials/auth/login.html',
        controller: 'LoginCtrl',
        resolve: {
          skipIfAuthenticated: _skipIfAuthenticated
        },        
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'partials/auth/signup.html',
        controller: 'SignupCtrl',
        resolve: {
          skipIfAuthenticated: _skipIfAuthenticated
        },    
      })
      .state('forgotpassword', {
        url: '/forgotpassword',
        templateUrl: 'partials/auth/forgotpassword.html',
        controller: 'ForgotCtrl',
        resolve: {
          skipIfAuthenticated: _skipIfAuthenticated
        },
      })
      .state('verifyotp', {
        url: '/verifyotp',
        templateUrl: 'partials/auth/verifyotp.html',
        controller: 'VerifyOTPController',
        resolve: {
          skipIfAuthenticated: _skipIfAuthenticated
        },
        onEnter: function ($state, $stateParams) {
          if (!$stateParams.mobile) {
            $state.go('signup');
          }
        },
        params: {
          mobile: null,
      }
      })
      .state('verifyforgotpassword', {
        url: '/verifyforgotpassword',
        templateUrl: 'partials/auth/verifyforgotpassword.html',
        controller: 'VerifyForgotPasswordController',
        resolve: {
          skipIfAuthenticated: _skipIfAuthenticated
        },
        onEnter: function ($state, $stateParams) {
          if (!$stateParams.mobile) {
            $state.go('forgotpassword');
          }
        },
        params: {
          mobile: null,
      }
      })
      .state('salesdashboard', {
        url: '/salesdashboard',
        templateUrl: 'partials/salesdashboard.html',
        controller: 'DashboardController',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
      })
      .state('school_master', {
        url: '/profile/schools',
        templateUrl: 'partials/school_master.html',
        controller: 'SchoolMasterController',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
      })
      .state('school_create', {
        url: '/profile/schools/create',
        templateUrl: 'partials/school_create.html',
        controller: 'SchoolCreateController',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        }
      })
      .state('school_basic_profile', {
        url: '/profile/schools/{schoolname}/basicprofile',
        templateUrl: 'partials/school_basic_profile.html',
        controller: 'SchoolBasicProfileController',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
        onEnter: function ($state, $stateParams) {
          if (!$stateParams.schoolId) {
            $state.go('school_master');
          }
        },
        params: {
          schoolId: null,
          schoolname: null,
      }
      })
      .state('school_class_config', {
        url: '/profile/schools/{schoolname}/schoolclassconfig',
        templateUrl: 'partials/school_class_config.html',
        controller: 'SchoolClassConfigController',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
        onEnter: function ($state, $stateParams) {
          if (!$stateParams.schoolId) {
            $state.go('school_master');
          }
        },
        params: {
          schoolId: null,
          schoolname: null,          
      }
      })
      .state('school_content_config', {
        url: '/profile/schools/{schoolname}/schoolcontentconfig',
        templateUrl: 'partials/school_content_config.html',
        controller: 'SchoolContentConfigController',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
        onEnter: function ($state, $stateParams) {
          if (!$stateParams.schoolId) {
            $state.go('school_master');
          }
        },
        params: {
          schoolId: null,
          schoolname: null,
      }
      })
      .state('school_documents', {
        url: '/profile/schools/{schoolname}/documents',
        templateUrl: 'partials/school_documents.html',
        controller: 'SchoolDocumentsController',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
        onEnter: function ($state, $stateParams) {
          if (!$stateParams.schoolId) {
            $state.go('school_master');
          }
        },
        params: {
          schoolId: null,
          schoolname:null,
      }
      })
      .state('school_paymentlist', {
        url: '/profile/schools/{schoolname}/payments',
        templateUrl: 'partials/school_paymentlist.html',
        controller: 'SchoolPaymentListController',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
        onEnter: function ($state, $stateParams) {
          if (!$stateParams.schoolId) {
            $state.go('school_master');
          }
        },
        params: {
          schoolId: null,
          schoolname:null,
      }
      })
      .state('school_agreement_document_download', {
        url: '/api/schools/{schoolId}/agreementdownload',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
        onEnter: function ($state, $stateParams) {
          if (!$stateParams.schoolId) {
            $state.go('school_master');
          }
        },
        params: {
          schoolId: null,
          schoolname:null,          
      }
      })
      .state('school_payment_invoice_download', {
        url: '/api/payments/{schoolId}/download',
        // templateUrl: 'partials/school_paymentlist.html',
        // controller: 'SchoolPaymentListController',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
        onEnter: function ($state, $stateParams) {
          if (!$stateParams.schoolId) {
            $state.go('school_master');
          }
        },
        params: {
          schoolId: null,
      }
      })
      .state('school_users', {
        url: '/profile/schools/{schoolname}/users',
        templateUrl: 'partials/school_users.html',
        controller: 'SchoolUsersController',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
        onEnter: function ($state, $stateParams) {
          if (!$stateParams.schoolId) {
            $state.go('school_master');
          }
        },
        params: {
          schoolId: null,
          schoolname:null,
      }
      })
      
      .state('student_promotion', {
        url: '/schools/{schoolname}/{schoolId}/promotion',
        templateUrl: 'partials/schoolManagement/studentpromotion.html',
        controller: 'Studentpromotioncontroller',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
        params: {
          schoolId: null,
          schoolname:null,
      }
      })
      .state('manage_students', {
        url: '/schools/{schoolname}/{schoolId}/students',
        templateUrl: 'partials/schoolManagement/manageStudents.html',
        controller: 'ManagestudentsController',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
        params: {
          schoolId: null,
          schoolname:null,
      }
      })
      .state('edit_student_management', {
        url: '/schools/{schoolname}/{schoolId}/students/{student_id}',
        templateUrl: 'partials/schoolManagement/edit_manage_student.html',
        controller: 'EditManagestudentsController',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
        params: {
          schoolId: null,
          schoolname: null,
      }
      })
      .state('add_student_management', {
        url: '/schools/{schoolname}/{schoolId}/addstudents',
        templateUrl: 'partials/schoolManagement/add_manage_student.html',
        controller: 'AddManagestudentsController',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
        params: {
          schoolId: null,
          schoolname: null,
      }
      })

      .state('class_teacherMapping', {
        url: '/profile/schools/{schoolname}/{schoolId}/classteachermapping',
        templateUrl: 'partials/schoolManagement/class_teacherMapping.html',
        controller: 'ClassteacherMappingController',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
        params: {
          schoolId: null,
          schoolname: null,
      }
      })
      .state('subject_teacherMapping', {
        url: '/profile/schools/{schoolname}/{schoolId}/subjectteachermapping',
        templateUrl: 'partials/schoolManagement/subject_teacherMapping.html',
        controller: 'SubjectteacherMappingController',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
        params: {
          schoolId: null,
          schoolname: null,
      }
      })
      .state('editBasicProfileSchool', {
        url: '/profile/schools/{schoolname}/{schoolId}/basicprofile',
        templateUrl: 'partials/schoolManagement/editBasicProfile.html',
        controller: 'EditBasicProfileSchoolController',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
        params: {
          schoolId: null,
          schoolname: null,
      }
      })
      .state('editBoyScore', {
        url: '/profile/schools/{schoolname}/{schoolId}/BOYscore',
        templateUrl: 'partials/boy/boyscores.html',
        controller: 'EditBoyScoreController',
        resolve: {
          redirectIfNotAuthenticated: _redirectIfNotAuthenticated
        },
        params: {
          schoolId: null,
          schoolname: null,
      }
      })
        .state('board', {
            url: '/schoolmaster/board',
            templateUrl: 'partials/schoolMasters/board.html',
            controller: 'boardController',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('subject', {
            url: '/schoolmaster/subject',
            templateUrl: 'partials/schoolMasters/subject.html',
            controller: 'subjectController',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('section', {
            url: '/schoolmaster/section',
            templateUrl: 'partials/schoolMasters/section.html',
            controller: 'sectionController',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('cluster', {
            url: '/schoolmaster/cluster',
            templateUrl: 'partials/schoolMasters/cluster.html',
            controller: 'clusterController',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('component', {
            url: '/schoolmaster/component',
            templateUrl: 'partials/schoolMasters/component.html',
            controller: 'componentController',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('resource-type', {
            url: '/schoolmaster/resource-type',
            templateUrl: 'partials/schoolMasters/resourceType.html',
            controller: 'resourceTypeController',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('role', {
            url: '/schoolmaster/role',
            templateUrl: 'partials/schoolMasters/role.html',
            controller: 'roleController',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('class', {
            url: '/schoolmaster/class',
            templateUrl: 'partials/schoolMasters/class.html',
            controller: 'classController',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('department', {
            url: '/systemmaster/department',
            templateUrl: 'partials/schoolManagement/department.html',
            controller: 'departmentController',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
            }
        })
        .state('designation', {
            url: '/systemmaster/designation',
            templateUrl: 'partials/schoolManagement/designation.html',
            controller: 'designationController',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
              }
        })
        .state('schoolroles', {
            url: '/systemmaster/schoolroles',
            templateUrl: 'partials/schoolManagement/roles.html',
            controller: 'schoolrolesController',
            resolve: {
                redirectIfNotAuthenticated: _redirectIfNotAuthenticated
              }
        })
        .state('addcommunication', {
          url: '/systemmaster/communicationadd',
          templateUrl: 'partials/communication/add.html',
          controller: 'addcommunicationController',
          resolve: {
            redirectIfNotAuthenticated: _redirectIfNotAuthenticated
          }
        })
        .state('viewcommunication', {
          url: '/systemmaster/communicationview',
          templateUrl: 'partials/communication/view.html',
          controller: 'viewcommunicationController',
          resolve: {
            redirectIfNotAuthenticated: _redirectIfNotAuthenticated
          }
        })
        .state('classDivision', {
          url: '/profile/schools/{schoolname}/{schoolId}/classDivision',
        templateUrl: 'partials/schoolManagement/classDivision.html',
        controller: 'classDivisionController',
          resolve: {
            redirectIfNotAuthenticated: _redirectIfNotAuthenticated
          }
        })
      .state('logout', {
        url: '/logout',
        controller: 'LogoutCtrl',
        // controller: function($location, $scope, $window) {
        //     $window.localStorage.clear();
        //     $location.path('/login');
        //   },
      })
      .state('404', {
        url: '/404',
        templateUrl: 'partials/404.html',        
      });

    $authProvider.loginUrl = '/login';
    $authProvider.signupUrl = '/signup';

    function _skipIfAuthenticated($location, $auth) {
      if ($auth.isAuthenticated()) {
        $location.path('/salesdashboard');
      }
    }

    function _redirectIfNotAuthenticated($location, $auth) {
      if (!$auth.isAuthenticated()) {
        $location.path('/login');
      }
    }
  })
  .constant('_', window._)
  .run(function ($rootScope, $window, $state) {
    $rootScope._ = window._;
    if ($window.localStorage.user) {
      $rootScope.currentUser = JSON.parse($window.localStorage.user);
    }
    $rootScope.$on('$stateChangeSuccess',
      function (event, toState, toParams, fromState, fromParams) {
        switch (toState.name) {
          case 'signup':
            $rootScope.$header = false;
            $rootScope.$footer = false;
            $rootScope.$leftsidebar = false;
            $rootScope.$isExternalPage = true;
            break;
          case 'login':
            $rootScope.$header = false;
            $rootScope.$footer = false;
            $rootScope.$leftsidebar = false;
            $rootScope.$isExternalPage = true;            
            break;
          case 'forgotpassword':
            $rootScope.$header = false;
            $rootScope.$footer = false;
            $rootScope.$leftsidebar = false;
            $rootScope.$isExternalPage = true;
            break;
          case 'verifyotp':
            $rootScope.$header = false;
            $rootScope.$footer = false;
            $rootScope.$leftsidebar = false;
            $rootScope.$isExternalPage = true;
            break;
          case 'verifyforgotpassword':
            $rootScope.$header = false;
            $rootScope.$footer = false;
            $rootScope.$leftsidebar = false;
            $rootScope.$isExternalPage = true;
            break;
            case '404':
            $rootScope.$header = false;
            $rootScope.$footer = false;
            $rootScope.$leftsidebar = false;
            $rootScope.$isExternalPage = true;
            break;
          default:
            $rootScope.$header = true;
            $rootScope.$footer = true;
            $rootScope.$leftsidebar = true;
            $rootScope.$isExternalPage = false;            
        }
      });
      $rootScope.$on('$viewContentLoading', function(event, viewConfig)
      {
         angular.element(document).ready(function () {
          
        // "use strict";
        
                // Init Theme Core      
                Core.init();
        
                // Init Demo JS
                Demo.init();
        
                 // Init CanvasBG and pass target starting location
                 CanvasBG.init({
                     Loc: {
                         x: window.innerWidth / 2,
                         y: window.innerHeight / 3.3
                     },
                 });
       });
      });
  });
