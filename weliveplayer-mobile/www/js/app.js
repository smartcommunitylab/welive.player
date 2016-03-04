// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module(
    'weliveplayer',
    [
        'ionic',
        'ngCordova',
        'ngIOS9UIWebViewPatch',
        'pascalprecht.translate',
        'weliveplayer.services.config',
        'weliveplayer.services.login',
        'weliveplayer.services.playstore',
        'weliveplayer.services.storage',
        'weliveplayer.services.utils',
        'weliveplayer.controllers.app',
        'weliveplayer.controllers.home',
        'weliveplayer.controllers.login'])

    .run(function ($ionicPlatform, $state, $rootScope, StorageSrv, LoginSrv, Config, Utils) {


        $rootScope.loginStarted = false;
        $rootScope.login = function () {

            if ($rootScope.loginStarted) return;

            $rootScope.loginStarted = true;
            LoginSrv.login().then(
                function (profile) {
                    $rootScope.loginStarted = false;

                    $state.go('app.home', {}, {
                        reload: true
                    });
                },
                function (error) {
                    $rootScope.loginStarted = false;
                    Utils.toast();
                    StorageSrv.saveUser(null);
                    ionic.Platform.exitApp();
                }
                );
        };

        $rootScope.logout = function () {
            LoginSrv.logout().then(
                function (data) {
                    $rootScope.login();
                    // ionic.Platform.exitApp();
                },
                function (error) {
                    // Utils.toast();
                }
                );
        };

        $ionicPlatform.ready(function () {

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            
            //disable login fix.
            // $state.go('app.home', {}, {
            //             reload: true
            //         });

            if (LoginSrv.userIsLogged()) {
                
                // LoginSrv.accessToken().then( 
                //     function (token) { 
                //         alert(token)
                //     },
                //     function (error) {
                //          alert(error);
                //     });
                
                $state.go('app.home', {}, {
                    reload: true
                });
            } else {
                $rootScope.login();
            }
            
            // LOG EVENT (PlayerAccess)
            var jsonPlayerAccess = Config.getPlayerAccessJson();
            var userId = StorageSrv.getLoggedInUserId();
            jsonPlayerAccess.custom_attr.UserID = userId;


            Utils.log(jsonPlayerAccess);

        });


    })


    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

            .state('app.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.info', {
                url: '/info',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/info.html'
                    }
                }
            })

            .state('app.termine', {
                url: '/termine',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/termine.html'
                    }
                }
            })

            .state('app.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html',
                        controller: 'LoginCtrl'
                    }
                }
            })


            .state('app.search', {
                url: '/apps/appSearch',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appSearch.html',
                        controller: 'AppSearchCtrl'
                    }
                }
            })

            .state('app.single', {
                url: '/apps/:appId/:appRegion',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appDetails.html',
                        controller: 'AppDetailCtrl'
                    }
                }
            })

            .state('app.comments', {
                url: '/apps/:appId/:appRegion',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appComments.html',
                        controller: 'AppCommentsCtrl'
                    }
                }
            });
    
    
        // if none of the above states are matched, use this as the fallback
        // $urlRouterProvider.otherwise('/app/home');
    
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise(function ($injector) {
            var logged = $injector.get('LoginSrv').userIsLogged();
            if (!logged) {
                return '/';
            }
            return '/app/home';
        });
    })

    .config(function ($translateProvider, $ionicConfigProvider) {
        $ionicConfigProvider.backButton.text('');
        $ionicConfigProvider.backButton.previousTitleText(false);
        $translateProvider.translations('it', {
            app_name: 'WeLivePlayer',
            lbl_search: 'Cerca',
            lbl_comment: 'Commenti',
            lbl_description: 'Descrizione',
            menu_home: 'Home',
            menu_info: 'Informazione',
            menu_termine: 'Termini del Servizio',
            menu_logout: 'Logout',
            toast_error_generic: 'OPS! Problema...',
            no_apps: 'Nessun app trovato.'
        });

        $translateProvider.translations('en', {
            app_name: 'WeLivePlayer',
            lbl_search: 'Search',
            lbl_comment: 'Comments',
            lbl_description: 'Description',
            menu_home: 'Home',
            menu_info: 'Information',
            menu_termine: 'Terms of Service',
            menu_logout: 'Logout',
            toast_error_generic: 'OPS! Problem...',
            no_apps: 'No application found.'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escape');
    });



