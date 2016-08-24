angular.module('weliveplayer.services.config', [])

    .factory('Config', function ($http, $q, $filter) {
        var AAC_SERVER_URL = "https://dev.welive.eu/dev/api/aac";
        var CLIENT_ID = "e4cd499e-81ac-4240-bd5c-1d4680f2f99f";
        var CLIENT_SEC_KEY = "6b934176-4513-43dd-a713-b926bfd979e2";
        var REDIRECT_URI = "http://localhost";
        var WELIVEPLAYER_SERVER = "https://dev.welive.eu/dev/api/weliveplayer/api/";
        var LOG_URI = "https://dev.welive.eu/dev/api/log/weliveplayer";
        var CDV_URI = "https://dev.welive.eu/dev/api/cdv";
        var PILOT_IDS = ["Bilbao", "Uusimaa", "Novisad", "Trento"];
        var PILOT_IDS_MAP = {
          "Bilbao": "Bilbao",
          "Uusimaa": "Uusimaa",
          "Novisad": "Novisad",
          "Trento": "Trento",
          "Bilbao": "Bilbao",
          "Helsinki Region": "Uusimaa",
          "Novi Sad": "Novisad"
        };
        var APP_TYPE = "PSA";
        var LANGUAGES = ["it", "en", "fi", "es", "sr", "sr_cyril"];
        var WEBAPPS_TYPES = ["Web Application", "Open Social Gadget"];
        var INFORMATION = {
            "it": "WeLive Player permette di scoprire e lanciare le applicazioni mobile sviluppate dagli utenti WeLive attraverso l'utilizzo della piattaforma WeLive.<br /><br />Tale piattaforma è uno dei risultati del progetto WeLive, un progetto H2020 finanziato dall'UE, il cui obiettivo è quello di promuovere un nuovo concetto di pubblica amministrazione, basato sulla co-creazione di servizi urbani mobili, insieme ai cittadini.<br /><br />WeLive Player è un contenitore in cui tutti i servizi creati dagli utenti WeLive, utilizzando la piattaforma WeLive, ed esposti sul Marketplace di WeLive, vengono mostrati e suggeriti agli utenti Android in base alle loro preferenze.<br /><br />I servizi disponibili sono raggruppati secondo le quattro città/regioni pilota coinvolte nella sperimentazione all'interno del progetto: Bilbao, Helsinki-Uusimaa, Novi Sad, Trento.<br /><br />L'applicazione permette di filtrare, cercare e ordinare le applicazioni in base a diversi criteri. All'utente viene chiesto di autenticarsi utilizzando un account social (Google/Facebook) o il proprio account WeLive. Durante il processo di autenticazione l'utente è invitato a fornire in modo facoltativo alcuni dati personali che verranno poi utilizzati dalla piattaforma WeLive per suggerire applicazioni potenzialmente interessanti per l'utente.<br /><br />WeLive Player permette quindi all'utente di scaricare e lanciare sul proprio smartphone le applicazioni scelte. Infine, esso mostra i commenti e le valutazioni espresse dagli utenti sul Marketplace di WeLive relativamente di tutte le applicazioni mostrate.",
            "en": "The WeLive Player gives the possibility to discover and launch the mobile apps developed by WeLive users using the WeLive framework.<br /><br />The WeLive framework is one of the results of the WeLive project, a H2020 project funded by the EU, whose goal is to foster a new concept of public administration, based on citizen co-created mobile urban services.<br /><br />The WeLive Player is a container in which all the services created by WeLive users using the WeLive framework, and exposed onto the WeLive Marketplace, are shown and suggested to Android users basing on their preferences.<br /><br />The available services are grouped by the four pilot cities/regions involved in the project: Bilbao, Helsinki-Usimaa, Novi Sad, Trento.<br /><br />The app allows to filter, search and order the apps using different criteria. It requires to authenticate using wither a social (Google/Facebook) or a WeLive account. During the authentication process the user is asked to optionally provide some personal details that are used by the WeLive framework to suggest apps that are more likely to be of interest.<br /><br />The WeLive Player allows to download and launch the apps chosen by the user. Finally, it shows the comments and ratings expressed by the users on the WeLive Marketplace about the apps.",
            "fi": "The WeLive Player gives the possibility to discover and launch the mobile apps developed by WeLive users using the WeLive framework.<br /><br />The WeLive framework is one of the results of the WeLive project, a H2020 project funded by the EU, whose goal is to foster a new concept of public administration, based on citizen co-created mobile urban services.<br /><br />The WeLive Player is a container in which all the services created by WeLive users using the WeLive framework, and exposed onto the WeLive Marketplace, are shown and suggested to Android users basing on their preferences.<br /><br />The available services are grouped by the four pilot cities/regions involved in the project: Bilbao, Helsinki-Usimaa, Novi Sad, Trento.<br /><br />The app allows to filter, search and order the apps using different criteria. It requires to authenticate using wither a social (Google/Facebook) or a WeLive account. During the authentication process the user is asked to optionally provide some personal details that are used by the WeLive framework to suggest apps that are more likely to be of interest.<br /><br />The WeLive Player allows to download and launch the apps chosen by the user. Finally, it shows the comments and ratings expressed by the users on the WeLive Marketplace about the apps.",
            "es": "WeLive Player permite descubrir y lanzar aplicaciones móviles desarrolladas por usuarios de WeLive a través de la plataforma WeLive.<br /><br />La plataforma WeLive es uno de los resultados del proyecto WeLive, un proyecto H2020 financiado por la UE, cuyos objetivo consiste en fomentar un nuevo concepto de administración pública, basada en servicios urbanos móviles co-creados por la ciudadanía.<br /><br />WeLive Player es un contenedor a través del cual se puede acceder a los diferentes servicios y aplicaciones creados por los usuarios a través de la plataforma WeLive y que son publicados en el MarketPlace de WeLive. Estos servicios son recomendados a los usuarios de Android en función de sus preferencias particulares.<br /><br />Los servicios disponibles están agrupados en cuatro ciudades/regiones piloto involucradas en el proyecto: Bilbao, Helsinki-Uusimaa, Novisad, Trento.<br /><br />Esta aplicación permite filtrar, buscar y ordenar las aplicaciones utilizando diferentes criterios. Requiere darse de alta a través de alguna red social (Google/Facebook) o de una cuenta de WeLive. Durante el proceso de identificación del usuario, éste es cuestionado acerca de algunos datos personales opcionales, que son empleados por el entorno WeLive para recomendar las aplicaciones que puedan resultar de mayor interés para el usuario.<br /><br />WeLive Player permite descargar y lanzar las aplicaciones seleccionadas por el usuario. Finalmente, muestra los comentarios y puntuaciones expresados por otros usuarios en el Marketplace de WeLive acerca de las aplicaciones.",
            "sr": "WeLive projekat daje mogućnosti da se otrkiju i pokrenu aplikacije za mobilni koje su od razvili WeLive korisnici koristeći WeLive okvir (framework).<br /><br />Welive okvir je jedan od od rezultata WeLive H2020 projekta finansiranog od strane EU, čiji je cilj da podstrektne novi koncept javne administracije, bazirane na ko-kreaciji mobilnih urbanih servisa od strane građana.<br /><br />WeLive Player je kontejner u kome su svi servisi kreirani korišćenjem WeLive okvira (i izloženi na WeLive Marektplace-u) prikazani i sugerisani Android korisnicima na osnovu njohovih preference.<br /><br />Dostupni servisi su grupisani za četiri pilot grada/regiona koji su uključeni u projekat: Bilbao, Helsinki-Usimaa, Novi  Sad, Trento.<br /><br />Aplikacija omogućava filtriranje, pretragu i naručivanje aplikacije korišćenjem  različitih kriterijuma. Zahteva se autentifikacija korišćenjem ili socijalnog (Google/Facebook) ili WeLive naloga. Za vreme procesa autentifikacije, korisniku se postavlja pitanje da opciono pruži neke lične detalje koji su korišćeni u WeLive okviru da bi sugerisao aplikacije koje će mu najverovatnije biti interesantne.<br /><br />WeLive Player omogućava skidanje i pokretanje aplikaciaj koje korisnik odabere. Konačno, prikazuje komentare i ocene od strane korisnika WeLive Marketplace-a o aplikacijama.",
            "sr_cyril": "The WeLive Player gives the possibility to discover and launch the mobile apps developed by WeLive users using the WeLive framework.<br /><br />The WeLive framework is one of the results of the WeLive project, a H2020 project funded by the EU, whose goal is to foster a new concept of public administration, based on citizen co-created mobile urban services.<br /><br />The WeLive Player is a container in which all the services created by WeLive users using the WeLive framework, and exposed onto the WeLive Marketplace, are shown and suggested to Android users basing on their preferences.<br /><br />The available services are grouped by the four pilot cities/regions involved in the project: Bilbao, Helsinki-Usimaa, Novi Sad, Trento.<br /><br />The app allows to filter, search and order the apps using different criteria. It requires to authenticate using wither a social (Google/Facebook) or a WeLive account. During the authentication process the user is asked to optionally provide some personal details that are used by the WeLive framework to suggest apps that are more likely to be of interest.<br /><br />The WeLive Player allows to download and launch the apps chosen by the user. Finally, it shows the comments and ratings expressed by the users on the WeLive Marketplace about the apps."
        }

        var CREDITINFOP1 = {
            "it": "Il progetto WeLive è stato finanziato dal programma H2020 della Commissione Europea per la ricerca, lo sviluppo tecnologico e l’ innovazione secondo l’accordo N° 645845",
            "en": "The WeLive project has been financed under European Commission's H2020 programme for research, development and innovation under agreement #64584",
            "fi": "The WeLive project has been financed under European Commission's H2020 programme for research, development and innovation under agreement #64584",
            "es": "The WeLive project has been financed under European Commission's H2020 programme for research, development and innovation under agreement #64584",
            "sr": "The WeLive project has been financed under European Commission's H2020 programme for research, development and innovation under agreement #64584",
            "sr_cyril": "The WeLive project has been financed under European Commission's H2020 programme for research, development and innovation under agreement #64584"
        }

        var HTTP_CONFIG = {
            timeout: 5000
        };

        var LOG_PLAYER_ACCESS = {
            "msg": "PlayerAccess"
            , "appId": "weliveplayer"
            , "type": "PlayerAccess"
            , "custom_attr": {
                "userid": ""
            }
        }
        var LOG_APP_OPEN = {
            "msg": "AppOpen"
            , "appId": "weliveplayer"
            , "type": "AppOpen"
            , "custom_attr": {
                "userid": "",
                "appid": "",
                "pilot": "",
                "appname": ""
            }
        }

        var LOG_APP_DOWNLOAD = {
            "msg": "AppDownload"
            , "appId": "weliveplayer"
            , "type": "AppDownload"
            , "custom_attr": {
                "userid": "",
                "appid": "",
                "pilot": "",
                "appname": ""
            }
        }

        var LOG_APP_INFO_ACCESS = {
            "msg": "AppInfoAccess"
            , "appId": "weliveplayer"
            , "type": "AppInfoAccess"
            , "custom_attr": {
                "UserID": ""
                , "AppID": ""
                , "PilotID": ""
            }
        }

        var LOG_APP_SEARCH = {
            "msg": "PlayerAppSearch",
            "appId": "weliveplayer",
            "type": "PlayerAppSearch",
            "custom_attr": {
                "userid": "",
                "pilot": ""
            }
        }

        var ZOOM = 15;

        var RATING_MAX = 5;

        return {
            getLogUri: function () {
                return LOG_URI;
            }
            , getServerURL: function () {
                return AAC_SERVER_URL;
            }
            , getZoom: function () {
                return ZOOM;
            }
            , getRatingMax: function () {
                return RATING_MAX;
            }
            , getRedirectUri: function () {
                return REDIRECT_URI;
            }
            , getClientId: function () {
                return CLIENT_ID;
            }
            , getClientSecKey: function () {
                return CLIENT_SEC_KEY;
            }
            , getHTTPConfig: function () {
                return HTTP_CONFIG;
            }
            , getWeLiveProxyUri: function () {
                return WELIVEPLAYER_SERVER;
            }
            , getPlayerAccessJson: function () {
                return LOG_PLAYER_ACCESS;
            }
            , getAppDownloadJson: function () {
                return LOG_APP_DOWNLOAD;
            }
            , getAppOpenJson: function () {
                return LOG_APP_OPEN;
            }
            , getAppInfoAccessJson: function () {
                return LOG_APP_INFO_ACCESS;
            }
            , getPlayerAppSearchJson: function () {
                return LOG_APP_SEARCH;
            }
            , getPilotIds: function () {
                return PILOT_IDS;
            }
            , getPilotMap: function () {
                return PILOT_IDS_MAP;
            }
            , getCDVUri: function () {
                return CDV_URI;
            }
            , getDefaultAppType: function () {
                return APP_TYPE;
            }
            , getSupportedLanguages: function () {
                return LANGUAGES;
            }
            , getAppInformation: function (lang) {
                if (INFORMATION[lang]) {
                    return INFORMATION[lang];
                }
            },
            getCreditInfoP1: function (lang) {
                if (CREDITINFOP1[lang]) {
                    return CREDITINFOP1[lang];
                }
            }
            , getWebAppTypes: function () {
                return WEBAPPS_TYPES;
            }
        }
    });
