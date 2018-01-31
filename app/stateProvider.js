angular.module('MyApp', ['satellizer', 'ui.router'])
    .config(function($locationProvider, $authProvider, $stateProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise("404");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'partials/home.html'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'partials/contact.html',
                controller: 'ContactCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'partials/login.html',
                controller: 'LoginCtrl'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'partials/signup.html',
                controller: 'SignupCtrl'
            })
            .state('account', {
                url: '/account',
                templateUrl: 'partials/profile.html',
                controller: 'ProfileCtrl'
            })
            .state('forgot', {
                url: '/forgot',
                templateUrl: 'partials/forgot.html',
                controller: 'ForgotCtrl'
            })
            .state('reset', {
                url: '/reset/:token',
                templateUrl: 'partials/reset.html',
                controller: 'ResetCtrl'
            })
            .state('404', {
                url: '/404',
                templateUrl: 'partials/404.html'
            });

        $authProvider.loginUrl = '/login';
        $authProvider.signupUrl = '/signup';

        function skipIfAuthenticated($location, $auth) {
            if ($auth.isAuthenticated()) {
                $location.path('/');
            }
        }

        function loginRequired($location, $auth) {
            if (!$auth.isAuthenticated()) {
                $location.path('/login');
            }
        }
    });
