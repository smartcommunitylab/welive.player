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
        'weliveplayer.controllers.profile'])

    .run(function ($ionicPlatform, $state, $rootScope, $translate, StorageSrv, LoginSrv, Config, Utils) {


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
                    window.location.reload(true);
                },
                function (error) {
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

            if (typeof navigator.globalization !== "undefined") {
                navigator.globalization.getPreferredLanguage(function (language) {
                    var lang = language.value.split("-")[0];
                    if (Config.getSupportedLanguages().indexOf(lang) > -1) {
                        $translate.use((language.value).split("-")[0]).then(function (data) {
                            console.log("SUCCESS -> " + data);
                        }, function (error) {
                            console.log("ERROR -> " + error);
                        });
                    } else {
                        $translate.use("en").then(function (data) {
                            console.log("SUCCESS -> " + data);
                        }, function (error) {
                            console.log("ERROR -> " + error);
                        });
                    }

                }, null);
            }
            
            //disable login fix.
            // $state.go('app.profile', {}, {
            //             reload: true
            //         });
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

            .state('app.profile', {
                url: '/profile',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html',
                        controller: 'ProfileCtrl'
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
            menu_profile: 'Profilo',
            menu_info: 'Informazioni',
            menu_termine: 'Termini del servizio',
            menu_logout: 'Esci',
            toast_error_generic: 'Errore! Riavvia la app.',
            no_apps: 'Nessuna app trovata. Effettua una nuova ricerca.',
            no_apps_no_selection: 'Seleziona una città per visualizzare le relative App.',
            lbl_popup_title: 'Scegli un ordinamento',
            lbl_popup_recommended: 'Consigliate',
            lbl_popup_recent: 'Più recenti',
            lbl_popup_popular: 'Più popolari',
            lbl_popup_alphbetical: 'Alfabetico',
            lbl_home_recommended: 'Consigliata',
            lbl_popup_button_ok: 'ORDINA',
            lbl_popup_button_cancel: 'ANNULLA',
            lbl_name: 'Nome',
            lbl_surname: 'Cognome',
            lbl_gender: 'Genere',
            lbl_dob: 'Data di nascita',
            lbl_addr: 'Indrizzo',
            lbl_pilotId: 'Città pilota',
            lbl_city: 'Citta',
            lbl_country: 'Stato',
            lbl_zipcode: 'Cap',
            lbl_email: 'Email',
            lbl_languages: 'Lingue',
            lbl_isDeveloper: 'Sviluppatore',
            lbl_skills: 'Capacità',
            lbl_usedApps: 'Applicazioni utilizzate',
            lbl_profileData: 'Profilo',
            lbl_lastLoc: 'Posizione',
            lbl_save: 'SALVA',
            ver_info: 'Versione 0.0.1'
        });

        $translateProvider.translations('en', {
            app_name: 'WeLivePlayer',
            lbl_search: 'Search',
            lbl_comment: 'Comments',
            lbl_description: 'Description',
            menu_home: 'Home',
            menu_profile: 'Profile',
            menu_info: 'Information',
            menu_termine: 'Terms of Service',
            menu_logout: 'Logout',
            toast_error_generic: 'Error! Restart the App',
            no_apps: 'No application found. Try a new research.',
            no_apps_no_selection: 'Select a city to display its apps.',
            lbl_popup_title: 'Select an order',
            lbl_popup_recommended: 'Recommended',
            lbl_popup_recent: 'Most recent',
            lbl_popup_popular: 'Most popular',
            lbl_popup_alphbetical: 'Alphabetic',
            lbl_home_recommended: 'Recommended',
            lbl_popup_button_ok: 'ORDER',
            lbl_popup_button_cancel: 'CANCEL',
            lbl_name: 'Name',
            lbl_surname: 'Surname',
            lbl_gender: 'Gender',
            lbl_dob: 'Birthdate',
            lbl_addr: 'Address',
            lbl_pilotId: 'Pilot city',
            lbl_city: 'City',
            lbl_country: 'Country',
            lbl_zipcode: 'Zipcode',
            lbl_email: 'Email',
            lbl_languages: 'Languages',
            lbl_isDeveloper: 'Developer',
            lbl_skills: 'Skills',
            lbl_usedApps: 'Used Apps',
            lbl_profileData: 'Profile',
            lbl_lastLoc: 'Location',
            lbl_save: 'SAVE',
            ver_info: 'Version 0.0.1'

        });

        $translateProvider.translations('fi', {
            app_name: 'WeLivePlayer',
            lbl_search: 'Etsi',
            lbl_comment: 'Kommentit',
            lbl_description: 'Kuvaus',
            menu_home: 'Etusivu',
            menu_profile: 'Profiili',
            menu_info: 'Lisätietoja',
            menu_termine: 'Käyttöehdot',
            menu_logout: 'Kirjaudu ulos',
            toast_error_generic: 'Jotain meni pieleen! Käynnistä sovellus uudestaan.',
            no_apps: 'Sovellusta ei löydy. Yritä etsiä uudelleen.',
            no_apps_no_selection: 'Valitse kaupunki, jonka sovellukset haluat nähdä.',
            lbl_popup_title: 'Valitse järjestys',
            lbl_popup_recommended: 'Suositeltu',
            lbl_popup_recent: 'Uusi',
            lbl_popup_popular: 'Suosittu',
            lbl_popup_alphbetical: 'Aakkosjärjestys',
            lbl_home_recommended: 'Suositeltu',
            lbl_popup_button_ok: 'JÄRJESTÄ',
            lbl_popup_button_cancel: 'PERUUTA',
            lbl_name: 'Etunimi',
            lbl_surname: 'Sukunimi',
            lbl_gender: 'Sukupuoli',
            lbl_dob: 'Syntymäpäivä',
            lbl_addr: 'Osoite',
            lbl_pilotId: 'Pilottikaupunki',
            lbl_city: 'Kaupunki',
            lbl_country: 'Maa',
            lbl_zipcode: 'Postinumero',
            lbl_email: 'Sähköposti',
            lbl_languages: 'Kielet',
            lbl_isDeveloper: 'Kehittäjä',
            lbl_skills: 'Taidot',
            lbl_usedApps: 'Käytetyt Sovellukset',
            lbl_profileData: 'Profiili',
            lbl_lastLoc: 'Sijainti',
            lbl_save: 'TALLENNA',
            ver_info: 'Version 0.0.1'
        });

        $translateProvider.translations('es', {
            app_name: 'WeLivePlayer',
            lbl_search: 'Search',
            lbl_comment: 'Comments',
            lbl_description: 'Description',
            menu_home: 'Home',
            menu_profile: 'Profile',
            menu_info: 'Information',
            menu_termine: 'Terms of Service',
            menu_logout: 'Logout',
            toast_error_generic: 'Error! Restart the App',
            no_apps: 'No application found. Try a new research.',
            no_apps_no_selection: 'Select a city to display its apps.',
            lbl_popup_title: 'Select an order',
            lbl_popup_recommended: 'Recommended',
            lbl_popup_recent: 'Most recent',
            lbl_popup_popular: 'Most popular',
            lbl_popup_alphbetical: 'Alphabetic',
            lbl_home_recommended: 'Recommended',
            lbl_popup_button_ok: 'ORDER',
            lbl_popup_button_cancel: 'CANCEL',
            lbl_name: 'Name',
            lbl_surname: 'Surname',
            lbl_gender: 'Gender',
            lbl_dob: 'Birthdate',
            lbl_addr: 'Address',
            lbl_pilotId: 'Pilot city',
            lbl_city: 'City',
            lbl_country: 'Country',
            lbl_zipcode: 'Zipcode',
            lbl_email: 'Email',
            lbl_languages: 'Languages',
            lbl_isDeveloper: 'Developer',
            lbl_skills: 'Skills',
            lbl_usedApps: 'Used Apps',
            lbl_profileData: 'Profile',
            lbl_lastLoc: 'Location',
            lbl_save: 'SAVE',
            ver_info: 'Version 0.0.1'
        });

        $translateProvider.translations('sr', {
            app_name: 'WeLivePlayer',
            lbl_search: 'Traži',
            lbl_comment: 'Komentari',
            lbl_description: 'Opis',
            menu_home: 'Početna strana',
            menu_profile: 'Profil',
            menu_info: 'Informacija',
            menu_termine: 'Uslovi korištenja Servisa',
            menu_logout: 'Odjava',
            toast_error_generic: 'Greška! Restartuj aplikaciju',
            no_apps: 'Nije pronašao aplikacija. Probajte novu pretragu.',
            no_apps_no_selection: 'Izaberi grad da prikaže svoje aplikacije.',
            lbl_popup_title: 'Izaberi poredak',
            lbl_popup_recommended: 'Preporučena',
            lbl_popup_recent: 'Najnovije',
            lbl_popup_popular: 'Popularno',
            lbl_popup_alphbetical: 'Alfabetski',
            lbl_home_recommended: 'Preporučena',
            lbl_popup_button_ok: 'NARU',
            lbl_popup_button_cancel: 'ODUSTANI',
            lbl_name: 'Ime',
            lbl_surname: 'Prezime',
            lbl_gender: 'Pol',
            lbl_dob: 'Dan rodenja',
            lbl_addr: 'Adresa',
            lbl_pilotId: 'Pilot grad',
            lbl_city: 'Grad',
            lbl_country: 'Zemlja',
            lbl_zipcode: 'Zipkod',
            lbl_email: 'Email',
            lbl_languages: 'Jezici',
            lbl_isDeveloper: 'Developer',
            lbl_skills: 'Veštine',
            lbl_usedApps: 'Korištene aplikacije',
            lbl_profileData: 'Profil',
            lbl_lastLoc: 'Lokacija',
            lbl_save: 'SAČUVAJ',
            ver_info: 'Version 0.0.1'
        });

        $translateProvider.translations('sr_cyril', {
            app_name: 'WeLivePlayer',
            lbl_search: 'Traži',
            lbl_comment: 'Komentari',
            lbl_description: 'Opis',
            menu_home: 'Početna strana',
            menu_profile: 'Profil',
            menu_info: 'Informacija',
            menu_termine: 'Uslovi korištenja Servisa',
            menu_logout: 'Odjava',
            toast_error_generic: 'Greška! Restartuj aplikaciju',
            no_apps: 'Nije pronašao aplikacija. Probajte novu pretragu.',
            no_apps_no_selection: 'Izaberi grad da prikaže svoje aplikacije.',
            lbl_popup_title: 'Izaberi poredak',
            lbl_popup_recommended: 'Preporučena',
            lbl_popup_recent: 'Najnovije',
            lbl_popup_popular: 'Popularno',
            lbl_popup_alphbetical: 'Alfabetski',
            lbl_home_recommended: 'Preporučena',
            lbl_popup_button_ok: 'NARU',
            lbl_popup_button_cancel: 'ODUSTANI',
            lbl_name: 'Ime',
            lbl_surname: 'Prezime',
            lbl_gender: 'Pol',
            lbl_dob: 'Dan rodenja',
            lbl_addr: 'Adresa',
            lbl_pilotId: 'Pilot grad',
            lbl_city: 'Grad',
            lbl_country: 'Zemlja',
            lbl_zipcode: 'Zipkod',
            lbl_email: 'Email',
            lbl_languages: 'Jezici',
            lbl_isDeveloper: 'Developer',
            lbl_skills: 'Veštine',
            lbl_usedApps: 'Korištene aplikacije',
            lbl_profileData: 'Profil',
            lbl_lastLoc: 'Lokacija',
            lbl_save: 'SAČUVAJ',
            ver_info: 'Version 0.0.1'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escape');
    });



