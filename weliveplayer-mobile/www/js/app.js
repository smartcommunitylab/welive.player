// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module(
    'weliveplayer', [
        'ionic',
        'ngCordova',
        'ngIOS9UIWebViewPatch',
        'pascalprecht.translate',
        'ngMask',
        'weliveplayer.services.config',
        'weliveplayer.services.login',
        'weliveplayer.services.playstore',
        'weliveplayer.services.storage',
        'weliveplayer.services.utils',
        'weliveplayer.controllers.app',
        'weliveplayer.controllers.home',
        'weliveplayer.controllers.profile',
        'weliveplayer.controllers.info',
        'weliveplayer.controllers.about',
        'weliveplayer.controllers.terms'
    ])

    .run(function ($ionicPlatform, $state, $rootScope, $translate, StorageSrv, LoginSrv, Config, Utils, $filter) {


        $rootScope.loginStarted = false;
        $rootScope.login = function () {

            if ($rootScope.loginStarted) return;

            $rootScope.loginStarted = true;
            LoginSrv.login().then(
                function (profile) {
                     // LOG EVENT (PlayerAccess)
                    var jsonPlayerAccess = Config.getPlayerAccessJson();
                    var userId = StorageSrv.getLoggedInUserId();
                    jsonPlayerAccess.custom_attr.userid = userId;
                    Utils.log(jsonPlayerAccess);
                    
                    $rootScope.loginStarted = false;
                    $state.go('app.termine');
                }
                , function (error) {
                    $rootScope.loginStarted = false;
                    Utils.toast($filter('translate')('lbl_error'));
                    StorageSrv.saveUser(null);
                    ionic.Platform.exitApp();
                }
            );
        };

        $rootScope.logout = function () {
            LoginSrv.logout().then(
                function (data) {
                    ionic.Platform.exitApp();
                }
                , function (error) {
                    Utils.toast($filter('translate')('lbl_error'));
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

        });


    })


    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app'
                , abstract: true
                , templateUrl: 'templates/menu.html'
                , controller: 'AppCtrl'
            })

            .state('app.home', {
                url: '/home'
                , views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html'
                        , controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.info', {
                url: '/info'
                , views: {
                    'menuContent': {
                        templateUrl: 'templates/info.html'
                        , controller: 'InfoCtrl'
                    }
                }
            })

            .state('app.about', {
                url: '/about'
                , views: {
                    'menuContent': {
                        templateUrl: 'templates/about.html'
                        , controller: 'AboutCtrl'
                    }
                }
            })

            .state('app.termine', {
                url: '/termine'
                , views: {
                    'menuContent': {
                        templateUrl: 'templates/termine.html'
                        , controller: 'TermsCtrl'
                    }
                }
            })

            .state('app.profile', {
                url: '/profile'
                , views: {
                    'menuContent': {
                        templateUrl: 'templates/profile.html'
                        , controller: 'ProfileCtrl'
                    }
                }
            })


            .state('app.search', {
                url: '/apps/appSearch'
                , views: {
                    'menuContent': {
                        templateUrl: 'templates/appSearch.html'
                        , controller: 'AppSearchCtrl'
                    }
                }
            })

            .state('app.single', {
                url: '/apps/:appId/:appRegion'
                , views: {
                    'menuContent': {
                        templateUrl: 'templates/appDetails.html'
                        , controller: 'AppDetailCtrl'
                    }
                }
            })

            .state('app.login', {
                url: '/login'
                , views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html'
                        , controller: 'LoginCtrl'
                    }
                }
            })

            .state('app.comments', {
                url: '/apps/:appId/:appRegion'
                , views: {
                    'menuContent': {
                        templateUrl: 'templates/appComments.html'
                        , controller: 'AppCommentsCtrl'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        // $urlRouterProvider.otherwise('/');

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise(function ($injector) {

            // var logged = $injector.get('LoginSrv').userIsLogged();
            // if (!logged) {
            //     return '/';
            // }
            // return '/';

            var storageService = $injector.get('StorageSrv');
            
            var isPrivacyAccepted = storageService.get("isPrivacyAccepted");

            if ($injector.get('LoginSrv').userIsLogged()) {

                // LOG EVENT (PlayerAccess)
                var jsonPlayerAccess = $injector.get('Config').getPlayerAccessJson();
                var userId = storageService.getLoggedInUserId();
                jsonPlayerAccess.custom_attr.userid = userId;
                $injector.get('Utils').log(jsonPlayerAccess);

                if (isPrivacyAccepted) {
                    return '/app/home';
                } else {
                    return '/app/termine';
                }
            } else {
                return '/app/login';
            }

        });
    })

    .config(function ($translateProvider, $ionicConfigProvider) {
        $ionicConfigProvider.backButton.text('');
        $ionicConfigProvider.backButton.previousTitleText(false);
        $translateProvider.translations('it', {
            app_name: 'WeLive Player'
            , lbl_search: 'Cerca'
            , lbl_comment: 'Commenti'
            , lbl_description: 'Descrizione'
            , menu_home: 'Home'
            , menu_profile: 'Profilo'
            , menu_info: 'Informazioni'
            , menu_about: 'Informazioni'
            , menu_termine: 'Termini del servizio'
            , menu_logout: 'Esci'
            , toast_error_generic: 'Errore! Riavvia la app.'
            , no_apps: 'Nessuna app trovata. Effettua una nuova ricerca.'
            , no_apps_no_selection: 'Seleziona una città per visualizzare le relative App.'
            , no_comments : 'Non ci sono commenti'
            , lbl_popup_title: 'Scegli un ordinamento'
            , lbl_popup_recommended: 'Consigliate'
            , lbl_popup_recent: 'Più recenti'
            , lbl_popup_popular: 'Più popolari'
            , lbl_popup_alphbetical: 'Alfabetico'
            , lbl_home_recommended: 'Consigliata'
            , lbl_popup_button_ok: 'ORDINA'
            , lbl_popup_button_cancel: 'ANNULLA'
            , lbl_name: 'Nome'
            , lbl_surname: 'Cognome'
            , lbl_gender: 'Genere'
            , lbl_male: 'Maschio'
            , lbl_female: 'Femmina'
            , lbl_dob: 'Data di nascita'
            , lbl_addr: 'Indirizzo'
            , lbl_pilotId: 'Città pilota'
            , lbl_city: 'Citta'
            , lbl_country: 'Stato'
            , lbl_zipcode: 'Cap'
            , lbl_email: 'Email'
            , lbl_languages: 'Lingue'
            , lbl_isDeveloper: 'Sviluppatore'
            , lbl_skills: 'Capacità'
            , lbl_userTags: 'Preferenze'
            , lbl_usedApps: 'Applicazioni utilizzate'
            , lbl_profileData: 'Profilo'
            , lbl_lastLoc: 'Posizione'
            , lbl_save: 'SALVA'
            , lbl_true: 'Vero'
            , lbl_false: 'Falso'
            , lbl_version: 'Versione'
            , lbl_inprogress: 'In costruzione'
            , lbl_comma_separated: 'separati da virgole'
            , lbl_error: 'errore'
            , lbl_accept: 'Accetto'
            , lbl_reject: 'Rifiuto'
            , about_subtitle: 'Termini e condizioni di utilizzo'
            , terms_refused_alert_text: 'Termini rifiutati.'
            , lbl_credit_p2: "Che cosa è?"
            , Italian: "Italiano"
            , Spanish: "Spagnolo"
            , Serbian: "Serbo"
            , SerbianLatin: "Serbo Latino"
            , Finnish: "Finlandese"
            , English: "Inglese"
        });

        $translateProvider.translations('en', {
            app_name: 'WeLive Player'
            , lbl_search: 'Search'
            , lbl_comment: 'Comments'
            , lbl_description: 'Description'
            , menu_home: 'Home'
            , menu_profile: 'Profile'
            , menu_info: 'Information'
            , menu_about: 'Information'
            , menu_termine: 'Terms of Service'
            , menu_logout: 'Logout'
            , toast_error_generic: 'Error! Restart the App'
            , no_apps: 'No application found. Try a new research.'
            , no_apps_no_selection: 'Select a city to display its apps.'
            , no_comments : 'No comments yet'
            , lbl_popup_title: 'Select an order'
            , lbl_popup_recommended: 'Recommended'
            , lbl_popup_recent: 'Most recent'
            , lbl_popup_popular: 'Most popular'
            , lbl_popup_alphbetical: 'Alphabetic'
            , lbl_home_recommended: 'Recommended'
            , lbl_popup_button_ok: 'ORDER'
            , lbl_popup_button_cancel: 'CANCEL'
            , lbl_name: 'Name'
            , lbl_surname: 'Surname'
            , lbl_gender: 'Gender'
            , lbl_male: 'Male'
            , lbl_female: 'Female'
            , lbl_dob: 'Birthdate'
            , lbl_addr: 'Address'
            , lbl_pilotId: 'Pilot city'
            , lbl_city: 'City'
            , lbl_country: 'Country'
            , lbl_zipcode: 'Zipcode'
            , lbl_email: 'Email'
            , lbl_languages: 'Languages'
            , lbl_isDeveloper: 'Developer'
            , lbl_skills: 'Skills'
            , lbl_userTags: 'Preferences'
            , lbl_usedApps: 'Used Apps'
            , lbl_profileData: 'Profile'
            , lbl_lastLoc: 'Location'
            , lbl_save: 'SAVE'
            , lbl_true: 'True'
            , lbl_false: 'False'
            , lbl_version: 'Version'
            , lbl_inprogress: 'Under construction'
            , lbl_comma_separated: 'separated by commas'
            , lbl_error: 'error'
            , lbl_accept: 'Accept'
            , lbl_reject: 'Reject'
            , about_subtitle: 'Information and Terms of Use'
            , terms_refused_alert_text: 'Terms refused.'
            , lbl_credit_p2: "What is it?"
            , Italian: "Italian"
            , Spanish: "Spanish"
            , Serbian: "Serbian"
            , SerbianLatin: "Serbian Latin"
            , Finnish: "Finnish"
            , English: "English"

        });

        $translateProvider.translations('fi', {
            app_name: 'WeLive Player'
            , lbl_search: 'Etsi'
            , lbl_comment: 'Kommentit'
            , lbl_description: 'Kuvaus'
            , menu_home: 'Etusivu'
            , menu_profile: 'Profiili'
            , menu_info: 'Lisätietoja'
            , menu_about: 'Lisätietoja'
            , menu_termine: 'Käyttöehdot'
            , menu_logout: 'Kirjaudu ulos'
            , toast_error_generic: 'Jotain meni pieleen! Käynnistä sovellus uudestaan.'
            , no_apps: 'Sovellusta ei löydy. Yritä etsiä uudelleen.'
            , no_apps_no_selection: 'Valitse kaupunki, jonka sovellukset haluat nähdä.'
            , lbl_popup_title: 'Valitse järjestys'
            , lbl_popup_recommended: 'Suositeltu'
            , lbl_popup_recent: 'Uusi'
            , lbl_popup_popular: 'Suosittu'
            , lbl_popup_alphbetical: 'Aakkosjärjestys'
            , lbl_home_recommended: 'Suositeltu'
            , lbl_popup_button_ok: 'JÄRJESTÄ'
            , lbl_popup_button_cancel: 'PERUUTA'
            , lbl_name: 'Etunimi'
            , lbl_surname: 'Sukunimi'
            , lbl_gender: 'Sukupuoli'
            , lbl_dob: 'Syntymäpäivä'
            , lbl_addr: 'Osoite'
            , lbl_pilotId: 'Pilottikaupunki'
            , lbl_city: 'Kaupunki'
            , lbl_country: 'Maa'
            , lbl_zipcode: 'Postinumero'
            , lbl_email: 'Sähköposti'
            , lbl_languages: 'Kielet'
            , lbl_isDeveloper: 'Kehittäjä'
            , lbl_skills: 'Taidot'
            , lbl_usedApps: 'Käytetyt Sovellukset'
            , lbl_profileData: 'Profiili'
            , lbl_lastLoc: 'Sijainti'
            , lbl_save: 'TALLENNA'
            , lbl_male: 'Mies'
            , lbl_female: 'Nainen'
            , lbl_true: 'True'
            , lbl_false: 'False'
            , Italian: "Italialainen"
            , Spanish: "Espanjalainen"
            , Serbian: "Serbia"
            , SerbianLatin: "Serbia latinalainen"
            , Finnish: "Suomi"
            , English: "Englantilainen"
            , lbl_userTags: 'Mieltymykset'
            , lbl_accept: 'Hyväksyn'
            , lbl_reject: 'En hyväksy'
            , about_subtitle: 'Käyttöehdot'
            , lbl_credit_p2: "Mikä se on?"

            , lbl_version: 'Version'
            , lbl_inprogress: 'Under construction'
            , lbl_comma_separated: 'separated by commas'
            , lbl_error: 'error'
            , terms_refused_alert_text: 'Terms refused.'
            , no_comments : 'No comments yet'

        });

        $translateProvider.translations('es', {
            app_name: 'WeLive Player'
            , lbl_search: 'Buscar'
            , lbl_comment: 'Comentarios'
            , lbl_description: 'Descripción'
            , menu_home: 'Inicio'
            , menu_profile: 'Perfil'
            , menu_info: 'Información'
            , menu_about: 'Información'
            , menu_termine: 'Condiciones del servicio'
            , menu_logout: 'Salir'
            , toast_error_generic: 'Error! Reinicie la aplicación'
            , no_apps: 'No se ha encontrado ninguna aplicación. Pruebe una nueva búsqueda.'
            , no_apps_no_selection: 'Sleccione una ciudad para mostrar sus aplicaciones.'
            , no_comments : 'No comments yet'
            , lbl_popup_title: 'Seleccione un orden'
            , lbl_popup_recommended: 'Recomendado'
            , lbl_popup_recent: 'Reciente'
            , lbl_popup_popular: 'Popular'
            , lbl_popup_alphbetical: 'Alfabéticamente'
            , lbl_home_recommended: 'Recomendado'
            , lbl_popup_button_ok: 'ORDENAR'
            , lbl_popup_button_cancel: 'CANCELAR'
            , lbl_name: 'Nombre'
            , lbl_surname: 'Apellido'
            , lbl_gender: 'Género'
            , lbl_dob: 'Fecha de nacimiento'
            , lbl_addr: 'Dirección'
            , lbl_pilotId: 'Ciudad piloto'
            , lbl_city: 'Ciudad'
            , lbl_country: 'País'
            , lbl_zipcode: 'Código Postal'
            , lbl_email: 'Email'
            , lbl_languages: 'Idiomas'
            , lbl_isDeveloper: 'Desarrollador'
            , lbl_skills: 'Habilidades'
            , lbl_usedApps: 'Aplicaciones utilizadas'
            , lbl_profileData: 'Perfil'
            , lbl_lastLoc: 'Ubicación'
            , lbl_save: 'GUARDAR'
            , lbl_true: 'Verdadero'
            , lbl_false: 'Falso'
            , lbl_accept: 'Acepto'
            , lbl_reject: 'No acepto'
            , about_subtitle: 'Términos y condiciones de uso'
            , lbl_male: 'Hombre'
            , lbl_female: 'Mujer'
            , lbl_userTags: 'Preferencias'
            , Italian: "Italiano"
            , Spanish: "Español"
            , Serbian: "Serbio"
            , SerbianLatin: "Serbio Latín"
            , Finnish: "Finés"
            , English: "Inglés"
            , lbl_credit_p2: "¿Qué es?"

            , lbl_version: 'Version'
            , lbl_inprogress: 'Under construction'
            , lbl_comma_separated: 'separated by commas'
            , lbl_error: 'error'
            , terms_refused_alert_text: 'Terms refused.'

        });

        $translateProvider.translations('sr', {
            app_name: 'WeLive Player'
            , lbl_search: 'Traži'
            , lbl_comment: 'Komentari'
            , lbl_description: 'Opis'
            , menu_home: 'Početna strana'
            , menu_profile: 'Profil'
            , menu_info: 'Informacija'
            , menu_about: 'Informacija'
            , menu_termine: 'Uslovi korištenja Servisa'
            , menu_logout: 'Odjava'
            , toast_error_generic: 'Greška! Restartuj aplikaciju'
            , no_apps: 'Nije pronašao aplikacija. Probajte novu pretragu.'
            , no_apps_no_selection: 'Izaberi grad da prikaže svoje aplikacije.'
            , no_comments : 'No comments yet'
            , lbl_popup_title: 'Izaberi poredak'
            , lbl_popup_recommended: 'Preporučena'
            , lbl_popup_recent: 'Najnovije'
            , lbl_popup_popular: 'Popularno'
            , lbl_popup_alphbetical: 'Alfabetski'
            , lbl_home_recommended: 'Preporučena'
            , lbl_popup_button_ok: 'NARU'
            , lbl_popup_button_cancel: 'ODUSTANI'
            , lbl_name: 'Ime'
            , lbl_surname: 'Prezime'
            , lbl_gender: 'Pol'
            , lbl_dob: 'Dan rodenja'
            , lbl_addr: 'Adresa'
            , lbl_pilotId: 'Pilot grad'
            , lbl_city: 'Grad'
            , lbl_country: 'Zemlja'
            , lbl_zipcode: 'Zipkod'
            , lbl_email: 'Email'
            , lbl_languages: 'Jezici'
            , lbl_isDeveloper: 'Developer'
            , lbl_skills: 'Veštine'
            , lbl_userTags: 'Prioritet'
            , lbl_usedApps: 'Korištene aplikacije'
            , lbl_profileData: 'Profil'
            , lbl_lastLoc: 'Lokacija'
            , lbl_save: 'SAČUVAJ'
            , lbl_true: 'Tačno'
            , lbl_false: 'Netačno'
            , lbl_accept: 'Ovlastiti'
            , lbl_reject: 'Poreći'
            , about_subtitle: 'Uslovi kоrišćenja'
            , Italian: "Italijanski"
            , Spanish: "Španski"
            , Serbian: "Srpski"
            , SerbianLatin: "Srpski latinica"
            , Finnish: "Finski"
            , English: "Engleski"
            , lbl_credit_p2: "Šta je to?"

            , lbl_version: 'Version'
            , lbl_inprogress: 'Under construction'
            , lbl_comma_separated: 'separated by commas'
            , lbl_error: 'error'
            , terms_refused_alert_text: 'Terms refused.'
            , lbl_male: 'Muški'
            , lbl_female: 'Ženski'

        });

        $translateProvider.translations('sr_cyril', {
            app_name: 'WeLive Player'
            , lbl_search: 'Тражи'
            , lbl_comment: 'Коментари'
            , lbl_description: 'Опис'
            , menu_home: 'Почетна страна'
            , menu_profile: 'Профил'
            , menu_info: 'Информација'
            , menu_about: 'Информација'
            , menu_termine: 'Услови коришћења сервиса'
            , menu_logout: 'Одјава'
            , toast_error_generic: 'Грешка! Рестартуј аплиакцију'
            , no_apps: 'Није пронађена апликација. Пробајте нову претрагу.'
            , no_apps_no_selection: 'Изабери грaд да прикаже своје апликације.'
            , no_comments : 'No comments yet'
            , lbl_popup_title: 'Изабери поредак'
            , lbl_popup_recommended: 'Препоручено'
            , lbl_popup_recent: 'Недавно'
            , lbl_popup_popular: 'Популарно'
            , lbl_popup_alphbetical: 'Алфабетски'
            , lbl_home_recommended: 'Препоручено'
            , lbl_popup_button_ok: 'НАРУЧИ'
            , lbl_popup_button_cancel: 'ОДУСТАНИ'
            , lbl_name: 'Име'
            , lbl_surname: 'Презиме'
            , lbl_gender: 'Пол'
            , lbl_dob: 'Дан рођења'
            , lbl_addr: 'Адреса'
            , lbl_pilotId: 'Пилот град'
            , lbl_city: 'Град'
            , lbl_country: 'Земља'
            , lbl_zipcode: 'Зипкод'
            , lbl_email: 'Имејл'
            , lbl_languages: 'Језици'
            , lbl_isDeveloper: 'Девелопер'
            , lbl_skills: 'Вештине'
            , lbl_usedApps: 'Коришћене апликације'
            , lbl_profileData: 'Профил'
            , lbl_lastLoc: 'Локација'
            , lbl_save: 'САЧУВАЈ'
            , lbl_true: 'Тачно'
            , lbl_false: 'Нетачно'
            , lbl_accept: 'Овластити'
            , lbl_reject: 'Порећи'
            , about_subtitle: 'Услови коришћења'
            , lbl_userTags: 'Приоритет'
            , lbl_male: 'Мушки'
            , lbl_female: 'Женски'
            , Italian: "Италијански"
            , Spanish: "Шпански"
            , Serbian: "Српски"
            , SerbianLatin: "Српски латиница"
            , Finnish: "Фински"
            , English: "Енглески"
            , lbl_credit_p2: "Шта је то?"

            , lbl_version: 'Version'
            , lbl_inprogress: 'Under construction'
            , lbl_comma_separated: 'separated by commas'
            , lbl_error: 'error'
            , terms_refused_alert_text: 'Terms refused.'

        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escape');
    });
