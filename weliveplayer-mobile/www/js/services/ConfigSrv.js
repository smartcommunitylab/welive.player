angular.module('weliveplayer.services.config', [])

    .factory('Config', function ($http, $q, $filter) {
        var SERVER_URL = "https://dev.welive.eu/aac/eauth/authorize";
        var SERVER_TOKEN_URL = "https://dev.welive.eu/aac/oauth/token";
        var SERVER_PROFILE_URL = "https://dev.welive.eu/aac/basicprofile/me";
        var CLIENT_ID = "e4cd499e-81ac-4240-bd5c-1d4680f2f99f";
        var CLIENT_SEC_KEY = "6b934176-4513-43dd-a713-b926bfd979e2";
        var REDIRECT_URI = "http://localhost";
        var WELIVE_PROXY = "https://dev.welive.eu/weliveplayer/api/";
        var WELIVE_API_URI = "https://dev.welive.eu/dev/api";

        var HTTP_CONFIG = {
            timeout: 5000
        };

        var ZOOM = 15;

        var RATING_MAX = 5;

        var LOGIN_EXPIRED = 'LOGIN_EXPIRED';

        return {
            getWeLiveAPIUri: function () {
              return WELIVE_API_URI;  
            },
            getServerURL: function () {
                return SERVER_URL;
            },
            getServerTokenURL: function () {
                return SERVER_TOKEN_URL;
            },
            getServerProfileURL: function () {
                return SERVER_PROFILE_URL;
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
            LOGIN_EXPIRED: LOGIN_EXPIRED,
            init: function () {
                /*
                var deferred = $q.defer();
    
                $http.get(Config.getServerURL()() + '/getparkingsbyagency/' + agencyId, Config.getHTTPConfig())
    
                .success(function (data) {
                    deferred.resolve(data);
                })
    
                .error(function (err) {
                    deferred.reject(err);
                });
    
                return deferred.promise;
                */
            }
        }
    });
