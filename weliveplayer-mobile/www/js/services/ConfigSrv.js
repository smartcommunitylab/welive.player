angular.module('weliveplayer.services.config', [])

    .factory('Config', function ($http, $q, $filter) {
        var SERVER_URL = "https://dev.welive.eu/aac/eauth/authorize";
        var SERVER_TOKEN_URL = "https://dev.welive.eu/aac/oauth/token";
        var SERVER_PROFILE_URL = "https://dev.welive.eu/aac/basicprofile/me";
        var CLIENT_ID = "1cc2f5f2-05a8-4153-b1ab-868096d629c0";
        var CLIENT_SEC_KEY = "df9a1151-34ab-4c5a-904d-a03de42e2881";
        var REDIRECT_URI = "http://localhost"

        var HTTP_CONFIG = {
            timeout: 5000
        };

        var ZOOM = 15;

        var RATING_MAX = 5;

        var LOGIN_EXPIRED = 'LOGIN_EXPIRED';

        return {
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
