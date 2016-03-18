angular.module('weliveplayer.services.config', [])

    .factory('Config', function ($http, $q, $filter) {
        var SERVER_URL = "https://dev.welive.eu/aac";
        var CLIENT_ID = "e4cd499e-81ac-4240-bd5c-1d4680f2f99f";
        var CLIENT_SEC_KEY = "6b934176-4513-43dd-a713-b926bfd979e2";
        var REDIRECT_URI = "http://localhost";
        var WELIVE_PROXY = "https://dev.welive.eu/weliveplayer/api/";
        var LOG_URI = "https://dev.welive.eu/welive.logging/log/weliveplayer";
        var CDV_URI = "https://dev.welive.eu/dev/api/cdv";
        var PILOT_IDS = ["BILBAO", "HELSINKI-USIMAA", "Novisad", "Trento"];
        var BASICAUTH_TOKEN = "Basic d2VsaXZlQHdlbGl2ZS5ldTp3M2wxdjN0MDBscw==";
        var APP_TYPE = "PSA";
        var LANGUAGES = ["en", "it"];

        var HTTP_CONFIG = {
            timeout: 5000
        };

        var LOG_PLAYER_ACCESS = {
            "msg": "PlayerAccess",
            "appId": "weliveplayer",
            "type": "PlayerAccess",
            "custom_attr": { "UserID": "" }
        }
        var LOG_APP_OPEN = {
            "msg": "AppOpen",
            "appId": "weliveplayer",
            "type": "AppOpen",
            "custom_attr": { "UserID": "", "AppID": "", "PilotID": "" }
        }

        var LOG_APP_DOWNLOAD = {
            "msg": "AppDownload",
            "appId": "weliveplayer",
            "type": "AppDownload",
            "custom_attr": { "UserID": "", "AppID": "", "PilotID": "" }
        }

        var LOG_APP_INFO_ACCESS = {
            "msg": "AppInfoAccess",
            "appId": "weliveplayer",
            "type": "AppInfoAccess",
            "custom_attr": { "UserID": "", "AppID": "", "PilotID": "" }
        }

        var ZOOM = 15;

        var RATING_MAX = 5;

        return {
            getLogUri: function () {
                return LOG_URI;
            },
            getServerURL: function () {
                return SERVER_URL;
            },
            getZoom: function () {
                return ZOOM;
            },
            getRatingMax: function () {
                return RATING_MAX;
            },
            getRedirectUri: function () {
                return REDIRECT_URI;
            },
            getClientId: function () {
                return CLIENT_ID;
            },
            getClientSecKey: function () {
                return CLIENT_SEC_KEY;
            },
            getHTTPConfig: function () {
                return HTTP_CONFIG;
            },
            getWeLiveProxyUri: function () {
                return WELIVE_PROXY;
            },
            getPlayerAccessJson: function () {
                return LOG_PLAYER_ACCESS;
            },
            getAppDownloadJson: function () {
                return LOG_APP_DOWNLOAD;
            },
            getAppOpenJson: function () {
                return LOG_APP_OPEN;
            },
            getAppInfoAccessJson: function () {
                return LOG_APP_INFO_ACCESS;
            },
            getPilotIds: function () {
                return PILOT_IDS;
            },
            getCDVUri: function () {
                return CDV_URI;
            },
            getBasicAuthToken: function () {
                return BASICAUTH_TOKEN;
            },
            getDefaultAppType: function () {
                return APP_TYPE;                
            },
            getSupportedLanguages: function () {
                return LANGUAGES;
            }
          
        }
    });
