angular.module('weliveplayer.services.storage', [])

    .factory('StorageSrv', function ($http, $q, Config) {
        var storageService = {};

        storageService.getUserId = function () {
            if (!!localStorage['userId']) {
                return localStorage['userId'];
            }
            return null;
        };

        storageService.get = function (privacyKey) {
            if (localStorage.getItem(privacyKey)) {
                return localStorage[privacyKey];
            }
            return null;
        }

        storageService.set = function (privacyKey, flag) {
            localStorage[privacyKey] = flag;
        }

        storageService.getLoggedInUserId = function () {
            if (!!localStorage['userId']) {
                var userInfo = JSON.parse(localStorage['userId']);
                return userInfo.userId;
            }
            return null;
        };

        storageService.getLoggedInUserPilotId = function () {
            if (!!localStorage['userId']) {
                var userInfo = JSON.parse(localStorage['userId']);
                return userInfo.pilotId;
            }
            return null;
        };

        storageService.saveUserId = function (userId) {
            var deferred = $q.defer();

            if (!!userId) {
                localStorage['userId'] = userId;
            } else {
                localStorage.removeItem('userId');
            }

            //here save it to user service too.
            deferred.resolve(userId);
            return deferred.promise;
        };

        storageService.getUser = function () {
            if (!!localStorage['userId']) {
                return JSON.parse(localStorage['userId']);
            }
            return null;
        };

        storageService.saveUser = function (profile) {
            var deferred = $q.defer();

            if (!!profile) {
                localStorage['userId'] = JSON.stringify(profile);
            } else {
                localStorage.removeItem('userId');
            }

            deferred.resolve(profile);
            return deferred.promise;
        };

        storageService.reset = function () {
            var deferred = $q.defer();
            localStorage.removeItem('userId');
            localStorage.removeItem('isPrivacyAccepted')
            deferred.resolve(true);
            return deferred.promise;
        };

        return storageService;
    });