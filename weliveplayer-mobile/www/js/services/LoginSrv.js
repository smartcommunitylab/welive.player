/* global ; */
angular.module('weliveplayer.services.login', [])

.factory('LoginSrv', function ($rootScope, $state, $q, $http, $window, StorageSrv, Config) {
    var loginService = {};

    var authWindow = null;

    loginService.userIsLogged = function () {
        return (StorageSrv.getUser() != null);
    };

    loginService.login = function () {

        var deferred = $q.defer();

        // log into the system and set userId
        var authapi = {
            authorize: function (url) {
                var deferred = $q.defer();

                var processThat = false;

                //Build the OAuth consent page URL
                var authUrl = 'https://dev.welive.eu/aac/eauth/authorize?client_id=' + Config.getClientId() + "&response_type=code&redirect_uri=" + Config.getRedirectUri();

                //Open the OAuth consent page in the InAppBrowser
                if (!authWindow) {
                    authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');
                    processThat = !!authWindow;
                }

                var processURL = function (url, deferred, w) {
                    var googleLocalWindow = null;
                    if (url == "https://dev.welive.eu/aac/eauth/google") { // Google Optimized Flow.
                        // alert("Google Flow.");
                        w.close();
                        window.plugins.googleplus.login(
                            {
                                // 'scopes': '... ', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                                'webClientId': Config.getGoogleSignInClientID(), // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                                // 'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
                            },
                            function (obj) {
                                var idToken = obj.idToken;
                                // call back googleLocal
                                var googleLocalUrl = 'https://dev.welive.eu/aac/eauth/authorize/googlelocal?token=' + idToken + '&client_id=' + Config.getClientId() + "&response_type=code&redirect_uri=" + Config.getRedirectUri();
                                googleLocalWindow = window.open(googleLocalUrl, '_blank', 'location=no,toolbar=no');
                                googleLocalWindow.addEventListener('loadstart', function (e) {
                                    var url = e.url;
                                    processURL(url, deferred, googleLocalWindow);
                                });
                            },
                            function (msg) {
                                deferred.reject();
                                authWindow = null;
                               // $state.go('app.home');
                                $rootScope.loginStarted = false;
                                $rootScope.login();
                                //loginService.login();
                            }
                        );
                    } 
                   
                    var success = /http:\/\/localhost(\/)?\?code=(.+)$/.exec(url);
                    var error = /\?error=(.+)$/.exec(url);
                    if (w && (success || error)) {
                        //Always close the browser when match is found
                        w.close();
                        authWindow = null;
                    }

                    if (success) {
                        var str = success[2];
                        // alert(success);
                        // debugger;
                        if (str.indexOf('#') > 0) {
                            // debugger;
                            str = str.substring(0, str.lastIndexOf('#'));
                        }
                        // alert(str);
                        console.log('success:' + decodeURIComponent(str));

                        // make second http post token.
                        loginService.makeTokenPost(str).then(function (tokenInfo) {
                                // append token info to data.
                                tokenInfo.token = str;

                                loginService.makeProfileCall(tokenInfo).then(function (profile) {
                                        profile.token = tokenInfo;
                                        // set expiry (after removing 1 hr).
                                        var t = new Date();
                                        t.setSeconds(t.getSeconds() + (profile.token.expires_in - 3600));
                                        profile.token.validUntil = t;

                                        // name: ""
                                        // socialId: "-29"
                                        // surname: ""
                                        // token: Object
                                        //  access_token: "2411a0a5-c2db-4c1d-bcf4-ba7541a53628"
                                        //  expires_in: 41249
                                        //  refresh_token: "7646b9a5-1af2-438c-ba88-bf34168afaf4"
                                        //  scope: "cdv.profile.me profile.accountprofile.me profile.basicprofile.me"
                                        //  token: "nZjddc"
                                        //  token_type: "bearer"
                                        //  validUntil: Mon Feb 29 2016 20:48:59 GMT+ 0000(GMT)
                                        // userId: "29"

                                        // make call to cdv profile.
                                        loginService.makeCDVProfileCall(profile.userId, profile.token.access_token).then(function(response) {
                                            //profile.userId
                                            if (response) {
                                                if (response.data.data) {
                                                    if (response.data.data.referredPilot) {
                                                        profile.pilotId = response.data.data.referredPilot;
                                                    }
                                                }
                                            }
                                            deferred.resolve(profile);
                                        }, function(error) {
                                            deferred.resolve(profile);
                                        });
                                    }
                                    , function (error) {
                                        deferred.reject(error[1]);
                                    });
                            }
                            , function (error) {
                                deferred.reject(error[1]);
                            })

                    } else if (error) {
                        //The user denied access to the app
                        deferred.reject({
                            error: error[1]
                        });
                    }
                }

                if (ionic.Platform.isWebView()) {
                    if (processThat) {
                        authWindow.addEventListener('loadstart', function (e) {
                            //console.log(e);
                            var url = e.url;
                            processURL(url, deferred, authWindow);
                        });
                    }
                } else {
                    angular.element($window).bind('message', function (event) {
                        $rootScope.$apply(function () {
                            processURL(event.data, deferred);
                        });
                    });
                }

                return deferred.promise;
            }
        };

        authapi.authorize().then(
            function (profile) {
                // debugger;
                console.log('success: ' + profile.userId);
                StorageSrv.saveUser(profile).then(function () {
                    deferred.resolve(profile);
                }, function (reason) {
                    StorageSrv.saveUser(null).then(function () {
                        deferred.reject(reason);
                    });
                });
            }
        );

        return deferred.promise;
    };

    loginService.logout = function () {
        var deferred = $q.defer();

        var logoutURL = "https://dev.welive.eu/aac/logout";

        $http.get(logoutURL)
            .then(
            function (response) {
                StorageSrv.reset().then(function (response) {
                    // alert("Success logout from welive.");
                    try {
                        cookieMaster.clear(function (success) {
                            console.log('Cookies have been cleared');
                            // alert('Cookies have been cleared');
                            window.plugins.googleplus.disconnect(function (msg) {
                                console.log("Logout from GooglePlus");
                                deferred.resolve(response);
                            }, function (error) {
                                deferred.resolve(error);
                            });
                        }, function (error) {
                            // alert('Cookies could not be cleared');
                            console.log('Cookies could not be cleared');
                            deferred.reject(error);
                        });
                    } catch (e) {
                        // alert('Cookies could not be cleared');
                        deferred.resolve(e);
                    }    
                    
                }, function (error) {
                    // alert('Cookies could not be cleared');
                    deferred.reject(error);
                    }
                );
            }, function (responseError) {
                // alert('Local Storage could not be cleared');
                deferred.reject(responseError);
            });
        
        return deferred.promise;
    };

    loginService.makeTokenPost = function makeTokenPost(code) {

        var deferred = $q.defer();

        var url = Config.getServerURL();
        var params = "/oauth/token?client_id=" + Config.getClientId() + "&client_secret=" + Config.getClientSecKey() + "&code=" + code + "&redirect_uri=" + Config.getRedirectUri() + "&grant_type=authorization_code";

        $http.post(url + params)

        .then(
            function (response) {
                if (response.data.access_token) {
                    deferred.resolve(response.data);
                } else {
                    deferred.reject();
                }


            }
            , function (responseError) {
                deferred.reject(responseError);
            }
        );


        return deferred.promise;

    }


    loginService.makeProfileCall = function makeProfileCall(tokenInfo) {

        var deferred = $q.defer();

        var url = Config.getServerURL() + "/basicprofile/me";

        $http.get(url, {
            headers: {
                "Authorization": "Bearer " + tokenInfo.access_token
            }
        })

        .then(
            function (response) {
                if (response.data.userId) {
                    deferred.resolve(response.data);
                } else {
                    deferred.reject("error retrieving profile.");
                }


            }
            , function (responseError) {
                deferred.reject("error retrieving profile.");
            }
        );

        return deferred.promise;

    }

    loginService.makeCDVProfileCall = function makeCDVProfileCall(userId, access_token) {

        var deferred = $q.defer();

        if (access_token) {
            var url = Config.getWeLiveProxyUri() + "userProfile";
            $http.get(url, {
                headers: {
                    "Authorization": "Bearer " + access_token
                }
            })

            .then(function (response) {
                if (response.data) {
                    deferred.resolve(response);
                } else {
                    deferred.reject("error retrieving profile.");
                }
            }, function (error) {
                deferred.reject("error retrieving profile.");
            })

        } else {
            loginService.accessToken().then(
                function (token) {
                    var url = Config.getWeLiveProxyUri() + "userProfile";
                    $http.get(url, {
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    })

                    .then(function (response) {
                        if (response.data) {
                            deferred.resolve(response);
                        } else {
                            deferred.reject("error retrieving profile.");
                        }
                    }, function (error) {
                        deferred.reject("error retrieving profile.");
                    })

                }
                , function (responseError) {
                    deferred.reject("error retrieving profile.");
                }

            );
        }

        return deferred.promise;

    }

    loginService.makeUpdateCDVProfile = function makeUpdateCDVProfile(profile) {

        var deferred = $q.defer();

        loginService.accessToken().then(
            function (token) {
                var url = Config.getWeLiveProxyUri() + "update/userProfile";
                $http.post(url, profile, {
                        headers: {
                            "Authorization": "Bearer " + token
                            , "Content-Type": "application/json"
                        }
                    })
                    .then(function (response) {
                        if (response.data.errorCode === 0) {
                            deferred.resolve(response);
                        } else {
                            deferred.reject("error updating profile.");
                        }
                    }, function (error) {
                        deferred.reject("error updating profile.");
                    })

            }
            , function (responseError) {
                deferred.reject("error updating profile.");
            }

        );


        return deferred.promise;
    }

    loginService.accessToken = function () {

        var deferred = $q.defer();

        var user = StorageSrv.getUser();

        if (user != null) {
            // alert("getAccessToken");

            // debugger;

            // check for expiry.
            var now = new Date();
            var saved = new Date(user.token.validUntil);
            if (saved.getTime() >= now.getTime()) {
                deferred.resolve(user.token.access_token);
            } else {
                var url = Config.getServerURL();
                var params = "/oauth/token?client_id=" + Config.getClientId() + "&client_secret=" + Config.getClientSecKey() + "&refresh_token=" + user.token.refresh_token + "&grant_type=refresh_token";

                $http.post(url + params)

                    .then(
                    function (response) {
                        // alert(response.data);
                        if (response.data.exception) {
                            // reforce login again.
                            loginService.logout().then(function success() {
                                loginService.login();
                            }, function error() { });
                        } else if (response.data.access_token) {
                            var access_token = response.data.access_token;
                            user.token.access_token = response.data.access_token;
                            user.token.refresh_token = response.data.refresh_token;
                            user.token.expires_in = response.data.expires_in;
                            // calculate expiry (after removing 1 hr).
                            var t = new Date();
                            t.setSeconds(t.getSeconds() + (response.data.expires_in - 3600));
                            user.token.validUntil = t;
                            // update token
                            StorageSrv.saveUser(user).then(function (success) { }, function (error) { });;

                            deferred.resolve(access_token);
                        } else {
                            deferred.reject("error retrieving token");
                        }
                    }
                    , function (responseError) {
                        deferred.reject("error retrieving token");
                    }
                    );

            }
        } else {
            deferred.reject("error retrieving token");
        }

        return deferred.promise;

    }

    return loginService;
});