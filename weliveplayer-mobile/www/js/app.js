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
		  'ionic-timepicker',
		  'ionic-datepicker',
		  'ngIOS9UIWebViewPatch',
		  'pascalprecht.translate',
		  'weliveplayer.services.config',
		  'weliveplayer.services.login',
		  'weliveplayer.services.user',
		  'weliveplayer.services.map',
		  'weliveplayer.services.geo',
		  'weliveplayer.services.storage',
		  'weliveplayer.services.utils',
		  'weliveplayer.services.cache',
		  'weliveplayer.directives',
		  'weliveplayer.controllers.app',
		  'weliveplayer.controllers.home',
		 'leaflet-directive' ])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
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
	});
})

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider

	.state('app', {
		url : '/app',
		abstract : true,
		templateUrl : 'templates/menu.html',
		controller : 'AppCtrl'
	})

	.state('app.info', {
		url : '/info',
		views : {
			'menuContent' : {
				templateUrl : 'templates/info.html'
			}
		}
	})

	.state('app.termine', {
		url : '/termine',
		views : {
			'menuContent' : {
				templateUrl : 'templates/termine.html'
			}
		}
	}).state('app.home', {
		url : '/home',
		views : {
			'menuContent' : {
				templateUrl : 'templates/home.html',
				controller : 'HomeCtrl'
			}
		}
	})

	.state('app.search', {
		url : '/apps/appSearch',
		views : {
			'menuContent' : {
				templateUrl : 'templates/appSearch.html',
				controller : 'AppSearchCtrl'
			}
		}
	})
	
	.state('app.single', {
		url : '/apps/:appId/:appRegion',
		views : {
			'menuContent' : {
				templateUrl : 'templates/appDetails.html',
				controller : 'AppDetailCtrl'
			}
		}
	})
	
	.state('app.comments', {
		url : '/apps/appComments/:appId',
		views : {
			'menuContent' : {
				templateUrl : 'templates/appComments.html',
				controller : 'AppCommentsCtrl'
			}
		}
	});
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/home');
})
	
.config(function ($translateProvider) {
    $translateProvider.translations('it', {
        app_name: 'WeLivePlayer',
        menu_home: 'Home',
        menu_info: 'Informazione',
        menu_termine: 'Termini del Servizio',
        menu_logout: 'Login/Logout',
        cancel: 'Annulla',
        yes: 'Si',
        no: 'No',
        ok: 'OK',
        action_chat: 'Chat',
        action_rate: 'Valuta',
        action_rejectbtn: 'Rifiuta',
        action_acceptbtn: 'Accetta',
        action_confirm: 'Conferma',
        menu_community: 'Comunità',
        menu_chat: 'Chat',
        menu_notifications: 'Notifiche',
        menu_profile: 'Profilo',
        modal_map: 'Scegli da mappa',
        modal_map_confirm: 'Conferma selezione',
        msg_talk: 'dice',
        lbl_all: 'tutti',
        lbl_no_results: 'Nessun risultato.',
        lbl_notifications: 'Desidero ricevere notifiche per:',
        lbl_newmessage: 'Nuovo Messaggio',
        lbl_notificationsettings: 'Impostazioni Notifiche',
        lbl_communityname: 'Nome Comunità',
        lbl_findcommunity: 'Cerca comunità',
        lbl_name: 'Nome',
        lbl_generalinformations: 'INFORMAZIONI GENERALI',
        lbl_from: 'Da',
        lbl_to: 'A',
        lbl_when: 'Alle',
        lbl_date: 'Data',
        lbl_time: 'Ora',
        lbl_time_departure: 'Ora di partenza',
        lbl_recurrency_none: 'Nessuna',
        lbl_offri: 'Pubblica',
        lbl_cerca: 'Cerca',
        lbl_mycommunity: 'Nelle mie community',
        lbl_allcommunity: 'In tutte le community',
        lbl_allsearchnotifications: 'Desidero ricevere tutte le notifiche per questa ricerca',
        lbl_start_time: 'Orario di partenza',
        lbl_components: 'Componenti',
        lbl_show_profile: 'Vedi Profilo',
        radio_daily: 'Giornaliera',
        radio_weekly: 'Settimanale',
        radio_monthly: 'Mensile',
        repeat_every_1: 'Ripeti ogni',
        repeat_every_2: 'days',
        dow_monday: 'Lunedì',
        dow_tuesday: 'Martedì',
        dow_wednesday: 'Mercoledì',
        dow_thursday: 'Giovedì',
        dow_friday: 'Venerdì',
        dow_saturday: 'Sabato',
        dow_sunday: 'Domenica',
        dow_monday_short: 'L',
        dow_tuesday_short: 'M',
        dow_wednesday_short: 'M',
        dow_thursday_short: 'G',
        dow_friday_short: 'V',
        dow_saturday_short: 'S',
        dow_sunday_short: 'D',
        month_jan: 'Gen',
        month_feb: 'Feb',
        month_mar: 'Mar',
        month_apr: 'Apr',
        month_may: 'Mag',
        month_jun: 'Giu',
        month_jul: 'Lug',
        month_ago: 'Ago',
        month_sep: 'Set',
        month_oct: 'Ott',
        month_nov: 'Nov',
        month_dic: 'Dic',
        popup_timepicker_title: 'Selezionare l\'ora',
        popup_datepicker_title: 'Selezionare il giorno',
        popup_datepicker_today: 'Oggi',
        toast_error_generic: 'OPS! Problema...',
    });
    
    $translateProvider.translations('en', {
        app_name: 'WeLivePlayer',
        menu_home: 'Home',
        menu_info: 'Information',
        menu_termine: 'End of Service',
        menu_logout: 'Login/Logout',
        cancel: 'Annulla',
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
    });

    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escape');
});


